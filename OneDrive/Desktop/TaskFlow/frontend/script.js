// BASE API URL
const API = "http://3.111.29.88:5000";


/* ============================================================
   UTIL FUNCTIONS
============================================================ */
function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

function handleError(err) {
    console.error(err);
    alert("Something went wrong. Check console.");
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* ============================================================
   LOAD TASKS
============================================================ */
async function loadTasks() {
    try {
        const date = qs("#taskDate").value;
        if (!date) {
            qs("#taskList").innerHTML = "<p>Select a date to view tasks.</p>";
            return;
        }

        const res = await fetch(`${API}/tasks?date=${encodeURIComponent(date)}`);
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        handleError(err);
    }
}

/* ============================================================
   RENDER TASKS
============================================================ */
function renderTasks(tasks) {
    const list = qs("#taskList");
    list.innerHTML = "";

    if (!tasks.length) {
        list.innerHTML = "<p>No tasks for this date.</p>";
        return;
    }

    tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task-card";

        div.innerHTML = `
            <div class="task-header">
                <h3>${escapeHtml(task.title)}</h3>
                <span class="status ${task.completed ? "done" : "pending"}">
                    ${task.completed ? "Completed" : "Pending"}
                </span>
            </div>

            <p>${escapeHtml(task.description || "")}</p>

            <div class="task-actions">
                <button class="complete-btn" data-id="${task.id}" ${task.completed ? "disabled" : ""}>✔ Complete</button>
                <button class="timer-btn" data-id="${task.id}">⏱ Start</button>
                <span id="timer-${task.id}" class="timer-label">Time: ${task.time_spent || 0} min</span>
                <button class="notes-toggle" data-id="${task.id}">📝 Notes</button>
                <button class="delete-btn" data-id="${task.id}">🗑 Delete</button>
            </div>

            <div id="notes-${task.id}" class="notes-section" style="display:none;">
                <textarea class="notes-input">${task.notes || ""}</textarea>
                <button class="save-notes-btn" data-id="${task.id}">Save Notes</button>
            </div>
        `;

        list.appendChild(div);
    });

    attachTaskEvents();
}

/* ============================================================
   TASK EVENT LISTENERS
============================================================ */
function attachTaskEvents() {
    // Mark complete
    qsa(".complete-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            await fetch(`${API}/tasks/${id}/complete`, { method: "PUT" });
            loadTasks();
        };
    });

    // Toggle notes
    qsa(".notes-toggle").forEach(btn => {
        btn.onclick = () => {
            const sec = qs(`#notes-${btn.dataset.id}`);
            sec.style.display = sec.style.display === "none" ? "block" : "none";
        };
    });

    // Save notes
    qsa(".save-notes-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            const notes = qs(`#notes-${id} .notes-input`).value;

            await fetch(`${API}/tasks/${id}/notes`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes })
            });

            loadTasks();
        };
    });

    // Delete
    qsa(".delete-btn").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            if (!confirm("Delete task?")) return;

            await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
            loadTasks();
        };
    });

    // Timers
    qsa(".timer-btn").forEach(btn => {
        btn.onclick = () => toggleTimer(btn.dataset.id);
    });
}

/* ============================================================
   ADD TASK
============================================================ */
async function addTask() {
    const title = qs("#title").value.trim();
    const description = qs("#description").value.trim();
    const date = qs("#taskDate").value;

    if (!title || !date) return alert("Enter title & date!");

    await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date })
    });

    qs("#title").value = "";
    qs("#description").value = "";
    loadTasks();
}

/* ============================================================
   TASK TIMER WITH SECONDS
============================================================ */
let taskTimers = {};     // {id: {seconds, interval}}

function toggleTimer(id) {
    if (taskTimers[id]) stopTaskTimer(id);
    else startTaskTimer(id);
}

function startTaskTimer(id) {
    const label = qs(`#timer-${id}`);

    if (!taskTimers[id]) taskTimers[id] = { seconds: 0 };

    qs(`.timer-btn[data-id="${id}"]`).textContent = "⏱ Stop";

    taskTimers[id].interval = setInterval(async () => {
        taskTimers[id].seconds++;

        const sec = taskTimers[id].seconds;
        const min = Math.floor(sec / 60);
        const rem = sec % 60;

        label.textContent = `Time: ${min}m ${rem}s`;

        // autosave to backend every minute
        if (rem === 0) {
            await fetch(`${API}/tasks/${id}/time`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ timeSpent: min })
            });
        }
    }, 1000);
}

function stopTaskTimer(id) {
    clearInterval(taskTimers[id].interval);
    delete taskTimers[id];

    qs(`.timer-btn[data-id="${id}"]`).textContent = "⏱ Start";
}

/* ============================================================
   DAILY RATING
============================================================ */
async function saveRating() {
    const date = qs("#taskDate").value;
    const rating = parseInt(qs("#rating").value) || 0;
    const notes = qs("#ratingNotes").value;

    if (!date) return alert("Select date first!");

    await fetch(`${API}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, rating, notes })
    });

    alert("Rating saved!");
}

/* ============================================================
   DARK / LIGHT MODE
============================================================ */
qs("#themeToggle").onclick = () => {
    document.body.classList.toggle("light-mode");

    qs("#themeToggle").textContent =
        document.body.classList.contains("light-mode")
            ? "🌞 Light Mode"
            : "🌙 Dark Mode";
};

/* ============================================================
/* ============================================================
   FIXED + FULLY WORKING POMODORO TIMER WITH RESUME
============================================================ */

let pomoTimer = null;
let pomoRemainingSeconds = 0;
let pomoCycles = 1;
let currentCycle = 1;
let pomoMode = "work";  // work / break
let pomoRunning = false;
let pomoPaused = false;

/* SOUND */
function playDing() {
    const audio = document.getElementById("pomoBeep");
    if (audio) audio.play().catch(() => {});
}

/* UPDATE TIMER UI */
function updatePomoDisplay() {
    const min = String(Math.floor(pomoRemainingSeconds / 60)).padStart(2, "0");
    const sec = String(pomoRemainingSeconds % 60).padStart(2, "0");
    document.getElementById("pomodoroLabel").textContent = `${min}:${sec}`;
}

/* START or RESUME POMODORO */
function startPomodoro() {

    const focusMin = parseInt(document.getElementById("pomoFocus").value) || 25;
    const breakMin = parseInt(document.getElementById("pomoBreak").value) || 5;
    pomoCycles = parseInt(document.getElementById("pomoCycles").value) || 1;

    /* ⭐ RESUME logic */
    if (pomoPaused && !pomoRunning && pomoRemainingSeconds > 0) {
        pomoPaused = false;
        pomoRunning = true;
        document.getElementById("pomoStatus").textContent = "⏱ Resumed";
        runPomodoroTick();
        return;
    }

    /* ⭐ FRESH START logic */
    pomoMode = "work";
    currentCycle = 1;
    pomoRemainingSeconds = focusMin * 60;
    pomoRunning = true;
    pomoPaused = false;

    document.getElementById("pomoStatus").textContent =
        `Work (${currentCycle}/${pomoCycles})`;

    updatePomoDisplay();
    runPomodoroTick();
}

/* PAUSE */
function pausePomodoro() {
    if (!pomoRunning) return;

    clearInterval(pomoTimer);
    pomoRunning = false;
    pomoPaused = true;

    document.getElementById("pomoStatus").textContent = "⏸ Paused";
}

/* RESET */
function resetPomodoro() {
    clearInterval(pomoTimer);

    pomoRemainingSeconds = 0;
    pomoRunning = false;
    pomoPaused = false;
    pomoMode = "work";
    currentCycle = 1;

    document.getElementById("pomodoroLabel").textContent = "00:00";
    document.getElementById("pomoStatus").textContent = "Ready";
}

/* MAIN TIMER LOOP */
function runPomodoroTick() {
    clearInterval(pomoTimer);

    pomoTimer = setInterval(() => {

        if (pomoRemainingSeconds > 0) {
            pomoRemainingSeconds--;
            updatePomoDisplay();
            return;
        }

        /* When a session ends */
        playDing();
        clearInterval(pomoTimer);
        pomoRunning = false;

        const focusSec = (parseInt(document.getElementById("pomoFocus").value) || 25) * 60;
        const breakSec = (parseInt(document.getElementById("pomoBreak").value) || 5) * 60;

        if (pomoMode === "work") {
            // Switch to break
            pomoMode = "break";
            pomoRemainingSeconds = breakSec;
            document.getElementById("pomoStatus").textContent =
                `Break (${currentCycle}/${pomoCycles})`;

        } else {
            // Break ended → next cycle
            currentCycle++;

            if (currentCycle > pomoCycles) {
                document.getElementById("pomoStatus").textContent = "🎉 All cycles complete!";
                updatePomoDisplay();
                return;
            }

            pomoMode = "work";
            pomoRemainingSeconds = focusSec;

            document.getElementById("pomoStatus").textContent =
                `Work (${currentCycle}/${pomoCycles})`;
        }

        pomoRunning = true;
        pomoPaused = false;
        updatePomoDisplay();
        runPomodoroTick();

    }, 1000);
}
