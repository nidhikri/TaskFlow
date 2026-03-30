const API = "http://localhost:3000/api";

/* ================= AUTH ================= */

function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

function requireAuth() {
    if (!getToken()) {
        alert("Please login first");
        throw new Error("No token");
    }
}

async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message);
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
    } else {
        alert(data.message);
    }
}

function logout() {
    localStorage.removeItem("token");
    alert("Logged out");
}

/* ================= TASKS ================= */

async function loadTasks() {
    requireAuth();

    const date = document.getElementById("taskDate").value;
    if (!date) return alert("Select date");

    const res = await fetch(`${API}/tasks?date=${date}`, {
        headers: authHeaders()
    });

    const data = await res.json();
    renderTasks(data.data || data);
}

function renderTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        const div = document.createElement("div");

        div.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || ""}</p>
            <button onclick="completeTask(${task.id})">✔</button>
            <button onclick="deleteTask(${task.id})">🗑</button>
        `;

        list.appendChild(div);
    });
}

async function addTask() {
    requireAuth();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("taskDate").value;

    await fetch(`${API}/tasks`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title, description, date })
    });

    loadTasks();
}

async function deleteTask(id) {
    requireAuth();

    await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });

    loadTasks();
}

async function completeTask(id) {
    requireAuth();

    await fetch(`${API}/tasks/${id}/complete`, {
        method: "PUT",
        headers: authHeaders()
    });

    loadTasks();
}

/* ================= RATING ================= */

async function saveRating() {
    requireAuth();

    const date = document.getElementById("taskDate").value;
    const rating = document.getElementById("rating").value;
    const notes = document.getElementById("ratingNotes").value;

    await fetch(`${API}/rating`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ date, rating, notes })
    });

    alert("Saved");
}

/* ================= THEME ================= */

document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light-mode");
};

/* ================= POMODORO ================= */

let timer;
let seconds = 0;

function startPomodoro() {
    clearInterval(timer);
    seconds = 1500;

    timer = setInterval(() => {
        seconds--;
        document.getElementById("pomodoroLabel").innerText = seconds;

        if (seconds <= 0) {
            clearInterval(timer);
            alert("Done!");
        }
    }, 1000);
}

function pausePomodoro() {
    clearInterval(timer);
}

function resetPomodoro() {
    clearInterval(timer);
    document.getElementById("pomodoroLabel").innerText = "00:00";
}