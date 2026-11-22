/* StudySpace - JavaScript */

// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

// Save tasks in the browser
function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

// Add a new task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        return;
    }

    const newTask = {
        name: taskName,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    showTasks();

    taskInput.value = "";
});

// Show all tasks
function showTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task, index) {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            tasks[index].completed = checkbox.checked;

            saveTasks();
            showTasks();
        });

        // Task name
        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.name;

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            tasks.splice(index, 1);

            saveTasks();
            showTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    updateProgress();
}

// Update dashboard statistics
function updateProgress() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    let percent = 0;

    if (total > 0) {
        percent = Math.round((completed / total) * 100);
    }

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    progressPercent.textContent = percent + "%";
    progressFill.style.width = percent + "%";
}

// Focus Timer
let timeLeft = 25 * 60;
let timerInterval = null;

const timerDisplay = document.getElementById("timer");

// Display timer
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

// Start timer
document.getElementById("startTimer").addEventListener("click", function() {
    if (timerInterval !== null) {
        return;
    }

    timerInterval = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        }

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            timerInterval = null;

            alert("Great job! Time for a break!");
        }
    }, 1000);
});

// Pause timer
document.getElementById("pauseTimer").addEventListener("click", function() {
    clearInterval(timerInterval);
    timerInterval = null;
});

// Reset timer
document.getElementById("resetTimer").addEventListener("click", function() {
    clearInterval(timerInterval);
    timerInterval = null;

    timeLeft = 25 * 60;
    updateTimer();
});

// Load the dashboard
showTasks();
updateTimer();
