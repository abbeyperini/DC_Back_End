let taskTitleInput = document.getElementById("taskTitleInput");
let addTask = document.getElementById("addTask");
let pendingTasks = document.getElementById("pendingTasks");
let completedTasks = document.getElementById("completedTasks");
let selectPriority = document.getElementById("priority");
let priorityValue = selectPriority.options[selectPriority.selectedIndex].value;

addTask.addEventListener("click", postTask);

taskTitleInput.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        addTask.click();
    };
});

function getAllTasks() {
    fetch('http://localhost:3000')
    .then(response => response.json())
    .then(json => displayAllTasks(json));
};

function clearAllTasks() {
    while (pendingTasks.firstChild) {
        pendingTasks.removeChild(pendingTasks.firstChild)
      };

    // while (completedTasks.firstChild) {
    //     completedTasks.removeChild(completedTasks.firstChild)
    // };
};

function displayAllTasks(tasks) {
    clearAllTasks();
    console.log(tasks)
    tasks.map((task) => {
        // <input type='checkbox' class='checkbox' onclick="changeTask(${task.id}, '${task.class}')">
        let taskItem = `<div class='task'>
        <h3>${task.taskName}</h3> 
        <p class="priority">Priority: ${task.priority}</p> 
        <p class="date">Date Added: ${task.date}</p>
        <button class='remove' onclick="deleteTask(${task.id})">Remove</button>
        </div>`;
        if (task.class == "pending") {
            pendingTasks.insertAdjacentHTML('beforeend', taskItem);
        } else if (task.class == "completed") {
            completedTasks.insertAdjacentHTML('beforeend', taskItem);
        };
    });
}

// Save a new TODO item 
function postTask() {
    let currentDate = new Date()
    let formatDate = `${(currentDate.getMonth() + 1)}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    
    fetch('http://localhost:3000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "taskName": taskTitleInput.value,
            "priority": priorityValue,
            "date": formatDate
        })
    });
    getAllTasks();
};

// Ability to delete an existing TODO item
function deleteTask(id) {
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
    });
    getAllTasks();
};

// Ability to update an existing TODO item
// Hard mode: user can sort pending tasks by drag and drop and order persists on page reload