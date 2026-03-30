# 🚀 TaskFlow – Full Stack Productivity App

## 📌 Overview

TaskFlow is a full-stack productivity app for managing tasks, notes, timers, and Pomodoro sessions with secure authentication and multi-user support.

---

## 🛠️ Tech Stack

* Backend: Node.js, Express, MySQL
* Auth: JWT, bcrypt
* Frontend: HTML, CSS, JavaScript
* Deployment: AWS EC2

---

## ✨ Features

* 🔐 User Login & Registration (JWT Auth)
* 📝 Task CRUD operations
* 👥 Multi-user support (user-specific tasks)
* ⏱️ Timer & Pomodoro
* ⭐ Daily productivity rating
* 🗒️ Notes per task

---

## 🧱 Architecture

```
Routes → Controllers → Models → Database
```

---

## 🔗 API Endpoints

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/tasks`
* POST `/api/tasks`
* PUT `/api/tasks/:id`
* DELETE `/api/tasks/:id`

---

## ⚙️ Run Locally

```
git clone https://github.com/nidhikri/TaskFlow.git
cd TaskFlow
npm install
node server.js
```

---

## 🚧 Future Improvements

* Input validation
* Pagination
* Role-based access
* Better UI

---

## 👩‍💻 Author

Nidhi Kumari
GitHub: https://github.com/nidhikri
LinkedIn: https://linkedin.com/in/nidhi-kumari3

---

## 💡 Summary

A secure full-stack app with authentication, REST APIs, and multi-user data handling.
