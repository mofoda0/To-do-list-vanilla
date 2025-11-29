let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskTime = document.getElementById("task-time");
const currentTasksList = document.getElementById("current-tasks");
const completedTasksList = document.getElementById("completed-tasks");

function domStarter(){
  showAllTasks();
}

function tasksList(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(event){
  event.preventDefault();
  let taskText = taskInput.value.trim();

  if (taskText === "") return;

  let newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  tasks.push(newTask);
  tasksList();
  showAllTasks();

  taskInput.value = "";
  taskTime.value = "";
}

function deleteTask(taskId){
  tasks = tasks.filter(task => task.id !== taskId);
  tasksList();
  showAllTasks();
}

function finishTask(taskId){
  tasks = tasks.map(task => {
    if (task.id === taskId){
      task.completed = !task.completed;
    }
    return task;
  });
  tasksList();
  showAllTasks();
}

function editTask(taskId, updatedText){
  tasks = tasks.map(task => {
    if (task.id === taskId){
      task.text = updatedText;
    }
    return task;
  });
  tasksList();
  showAllTasks();
}

function showAllTasks(){
  currentTasksList.innerHTML = "";
  completedTasksList.innerHTML = "";

  tasks.forEach(task => {
    let taskElement = taskBuilder(task);

    if (task.completed){
      completedTasksList.appendChild(taskElement);
    }else{
      currentTasksList.appendChild(taskElement);
    }
  });
}

function taskBuilder(task){
  let listItem = document.createElement("li");
  listItem.className = "task-item";

  if (task.completed){
    listItem.classList.add("completed");
  }
  
  let buttonsHtml = "";
  if (task.completed){
    buttonsHtml = `<button class="task-btn delete-btn">X</button>`;
  }else{
    buttonsHtml = 
    `
      <button class="task-btn complete-btn">✓</button>
      <button class="task-btn edit-btn">✏</button>
      <button class="task-btn delete-btn">X</button>
    `;
  }

  listItem.innerHTML = 
  `
    <div class="task-content">
      <span class="task-text">${task.text}</span>
    </div>
    <div class="task-actions">
      ${buttonsHtml}
    </div>
  `;

  let deleteButton = listItem.querySelector(".delete-btn");
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  if (!task.completed){
    let completeButton = listItem.querySelector(".complete-btn");
    completeButton.addEventListener("click", () => finishTask(task.id));

    let editButton = listItem.querySelector(".edit-btn");
    editButton.addEventListener("click", () => startEditingTask(listItem, task));
  }

  return listItem;
}
function startEditingTask(listItem, task){
  let taskContent = listItem.querySelector(".task-content");
  let originalText = task.text;

  taskContent.innerHTML = 
  ` <input type="text" class="edit-input" value="${originalText}">
    <button class="save-btn">save</button>
  `;

  let textInput = taskContent.querySelector(".edit-input");
  let saveButton = taskContent.querySelector(".save-btn");

  textInput.focus();

  saveButton.addEventListener("click", () => {
    let changedText = textInput.value.trim();
    if (changedText && changedText !== originalText){
      editTask(task.id, changedText);
    }else{
      showAllTasks();
    }
  });
}

taskForm.addEventListener("submit", addTask);
document.addEventListener("DOMContentLoaded", domStarter);