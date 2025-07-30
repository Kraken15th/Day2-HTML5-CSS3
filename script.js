const user = document.getElementById("user");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function showName() {
    const nameInput = document.getElementById("nameInput").value.trim();
    if (!nameInput) return;

    localStorage.setItem("userName", nameInput);
    user.innerHTML = `<h1>Welcome, ${nameInput}</h1>`;

    document.getElementById("inputSection").style.display = "none";
    document.getElementById("taskControls").style.display = "flex";
    document.getElementById("boardsSection").style.display = "flex";
}

function addTask() {
    const taskText = document.getElementById("taskInput").value.trim();
    if (!taskText) return;

    const task = {
        id: `task-${Date.now()}`,
        text: taskText,
        status: 'pending'
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    document.getElementById("taskInput").value = "";
}

function renderTasks() {
    document.getElementById("pendingTasks").innerHTML = "";
    document.getElementById("inProgressTasks").innerHTML = "";
    document.getElementById("completedTasks").innerHTML = "";

    tasks.forEach(task => {
        const taskDiv = createTaskElement(task);
        const targetBoard = {
            pending: "pendingTasks",
            inProgress: "inProgressTasks",
            completed: "completedTasks"
        }[task.status];
        document.getElementById(targetBoard).appendChild(taskDiv);
    });
}

function createTaskElement(task) {
    const div = document.createElement("div");
    div.className = "task-placeholder";
    div.id = task.id;
    div.setAttribute("draggable", "true");
    div.ondragstart = (event) => {
        event.dataTransfer.setData("item", task.id);
    };

    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;
    textSpan.style.flex = "1";

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.title = "Edit";
    editBtn.innerHTML = "✏️";
    editBtn.onclick = () => editTask(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.title = "Delete";
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(textSpan);
    div.appendChild(actions);

    return div;
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Edit your task:", task.text);
    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("item");
    const draggedTask = tasks.find(t => t.id === itemId);

    const boardId = event.currentTarget.id;
    draggedTask.status = {
        pendingBoard: "pending",
        inProgressBoard: "inProgress",
        completedBoard: "completed"
    }[boardId];

    saveTasks();
    renderTasks();
}

function setColor(event) {
    const selectedColor = event.target.getAttribute("data-color");
    document.body.style.backgroundColor = selectedColor;
    localStorage.setItem("bgColor", selectedColor);
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Restore UI on reload
window.onload = function () {
    const savedColor = localStorage.getItem("bgColor");
    const savedName = localStorage.getItem("userName");

    if (savedColor) document.body.style.backgroundColor = savedColor;
    if (savedName) {
        user.innerHTML = `<h1>Welcome, ${savedName}</h1>`;
        document.getElementById("inputSection").style.display = "none";
        document.getElementById("taskControls").style.display = "flex";
        document.getElementById("boardsSection").style.display = "flex";
    }

    renderTasks();
};