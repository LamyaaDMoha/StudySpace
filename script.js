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


// -------------------------
// Focus Timer
// -------------------------

// Default time is 25 minutes
let selectedMinutes = 25;
let timeLeft = selectedMinutes * 60;
let timerInterval = null;

// Get timer elements
const timerDisplay = document.getElementById("timer");
const durationButtons = document.querySelectorAll(".duration-btn");
const customTimeBox = document.getElementById("customTimeBox");
const customMinutes = document.getElementById("customMinutes");

// Display minutes and seconds
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Change timer duration
function changeDuration(minutes) {
    stopTimer();

    selectedMinutes = minutes;
    timeLeft = selectedMinutes * 60;

    updateTimer();
}

// Choose a time option
durationButtons.forEach(function(button) {
    button.addEventListener("click", function() {

        // Remove active style from all buttons
        durationButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        // Highlight the selected button
        button.classList.add("active");

        const minutes = button.dataset.minutes;

        if (minutes === "custom") {
            customTimeBox.hidden = false;

            let customValue = Number(customMinutes.value);

            // Allow from 1 to 180 minutes
            if (customValue < 1 || customValue > 180 || !Number.isInteger(customValue)) {
                customValue = 30;
                customMinutes.value = 30;
            }

            changeDuration(customValue);

        } else {
            customTimeBox.hidden = true;
            changeDuration(Number(minutes));
        }
    });
});

// Update custom time
customMinutes.addEventListener("change", function() {
    let minutes = Number(customMinutes.value);

    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
        alert("Please enter a number between 1 and 180.");
        customMinutes.value = selectedMinutes;
        return;
    }

    changeDuration(minutes);
});

// Start timer
document.getElementById("startTimer").addEventListener("click", function() {

    // Prevent starting multiple timers
    if (timerInterval !== null) {
        return;
    }

    // Restart the selected duration if time is finished
    if (timeLeft === 0) {
        timeLeft = selectedMinutes * 60;
        updateTimer();
    }

    timerInterval = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        }

        if (timeLeft === 0) {
            stopTimer();
            alert("Great job! Time for a break!");
        }
    }, 1000);
});

// Pause timer
document.getElementById("pauseTimer").addEventListener("click", function() {
    stopTimer();
});

// Reset timer
document.getElementById("resetTimer").addEventListener("click", function() {
    changeDuration(selectedMinutes);
});

// Load the dashboard
showTasks();
updateTimer();

