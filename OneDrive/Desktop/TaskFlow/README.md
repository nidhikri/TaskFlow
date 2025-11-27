# TaskFlow – Productivity & Task Tracking Web App

TaskFlow is a full-stack productivity and task-tracking application designed to help users manage daily activities efficiently. It includes task management, notes, daily rating, calendar view, Pomodoro timer, and time-tracking analytics.

--

## 🚀 Features

### ✔ Task Management
Create, update, delete, and track tasks with categories and priorities.

### ✔ Notes Workspace
A simple notes editor to store important thoughts and reminders.

### ✔ Daily Rating System
Record daily productivity levels to track your long-term performance.

### ✔ Calendar View
Monthly calendar to view tasks and notes at a glance.

### ✔ Pomodoro Timer
Built-in Pomodoro focus timer for deep-work sessions.

### ✔ Time Tracking & Analytics
Track time spent on tasks and view productivity patterns.

### ✔ Dark/Light Mode
Interactive and smooth theme toggle for better UI experience.

---

## 🛠 Tech Stack

### **Frontend**
- HTML  
- CSS  
- JavaScript  

### **Backend**
- Node.js  
- Express.js  
- REST API Architecture  

### **Database**
- MySQL  

### **Deployment**
- AWS EC2 (Ubuntu)  
- NGINX  
- PM2 Process Manager  

---

---

## 🔧 Installation & Setup

Follow these steps to run TaskFlow locally.

### 1️⃣ Clone the Repository
git clone https://github.com/
<your-username>/TaskFlow.git
cd TaskFlow

### 2️⃣ Backend Setup
cd backend
npm install

### 3️⃣ Create Environment File  
Inside `backend/`, create a file named **.env**:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=taskflow
PORT=5000


### 4️⃣ Start Backend Server
npm start

### 5️⃣ Open Frontend  
Open this file in the browser:
frontend/index.html

## 🌍 Deployment Guide (AWS EC2 + NGINX + PM2)

### Install Node on EC2
sudo apt update
sudo apt install nodejs npm

### Install PM2
sudo npm install pm2 -g

### Clone Repo on EC2

git clone https://github.com/
<your-username>/TaskFlow.git
cd TaskFlow/backend
npm install
pm2 start app.js
pm2 save

server {
    listen 80;
    server_name your-ec2-public-ip;

    location / {
        proxy_pass http://localhost:5000;
    }
}

![alt text](<WhatsApp Image 2025-11-27 at 7.42.21 PM-1.jpeg>)

