
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="task-actions">
                <button class="task-actions-btn" onclick="toggleDropdown(${index})">⋮</button>
                <div class="task-actions-dropdown" id="dropdown-${index}">
                    <button onclick="showEditDialog(${index})">Edit</button>
                    <button onclick="deleteTask(${index})">Delete</button>
                </div>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}

function toggleDropdown(index) {
    const dropdown = document.getElementById(`dropdown-${index}`);
    dropdown.classList.toggle('show');
}

function addTask(text) {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function showEditDialog(index) {
    const editDialog = document.getElementById('editTaskDialog');
    const editInput = document.getElementById('editTaskInput');
    editInput.value = tasks[index].text;
    editDialog.style.display = 'flex';

    document.getElementById('saveEditTask').onclick = function() {
        const newText = editInput.value.trim();
        if (newText) {
            tasks[index].text = newText;
            saveTasks();
            renderTasks();
            editDialog.style.display = 'none';
        }
    };

    document.getElementById('cancelEditTask').onclick = function() {
        editDialog.style.display = 'none';
    };
}

function searchTasks(query) {
    return tasks.filter(task => task.text.toLowerCase().includes(query.toLowerCase()));
}

document.getElementById('addTaskBtn').addEventListener('click', () => {
    document.getElementById('addTaskDialog').style.display = 'flex';
});

document.getElementById('saveNewTask').addEventListener('click', () => {
    const newTaskInput = document.getElementById('newTaskInput');
    if (newTaskInput.value.trim()) {
        addTask(newTaskInput.value.trim());
        newTaskInput.value = '';
        document.getElementById('addTaskDialog').style.display = 'none';
    }
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query) {
        const results = searchTasks(query);
        renderTasks(results);
    } else {
        renderTasks();
    }
});

document.querySelectorAll('.close-dialog').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.dialog-overlay').style.display = 'none';
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.matches('.task-actions-btn')) {
        const dropdowns = document.querySelectorAll('.task-actions-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

renderTasks();

// Implement search feature
const searchInput = document.getElementById('searchInput');
const taskList = document.getElementById('taskList');

searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const taskItems = taskList.getElementsByClassName('task-item');

    Array.from(taskItems).forEach(function(task) {
        const taskText = task.querySelector('span').textContent.toLowerCase();
        if (taskText.includes(searchTerm)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
});