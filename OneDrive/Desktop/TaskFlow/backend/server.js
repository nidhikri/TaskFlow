const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// -------------------- DATABASE CONNECTION --------------------
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Nidhi_098", 
    database: "taskflow"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL connected");
});

// -------------------- API ROUTES --------------------

// 1. Get tasks by date
app.get("/tasks", (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.json([]);
    }

    db.query("SELECT * FROM tasks WHERE date = ?", [date], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

// 2. Add new task
app.post("/tasks", (req, res) => {
    const { title, description, date } = req.body;

    const sql = "INSERT INTO tasks (title, description, date) VALUES (?, ?, ?)";
    db.query(sql, [title, description, date], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Task added", id: result.insertId });
    });
});

// 3. Mark task as completed
app.put("/tasks/:id/complete", (req, res) => {
    db.query(
        "UPDATE tasks SET completed = 1, status='completed' WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Task marked complete" });
        }
    );
});

// 4. Update time spent
app.put("/tasks/:id/time", (req, res) => {
    const { timeSpent } = req.body;

    db.query(
        "UPDATE tasks SET time_spent = ? WHERE id = ?",
        [timeSpent, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Time updated" });
        }
    );
});

// 5. Add notes to task
app.put("/tasks/:id/notes", (req, res) => {
    const { notes } = req.body;

    db.query(
        "UPDATE tasks SET notes = ? WHERE id = ?",
        [notes, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Notes added" });
        }
    );
});

// 6. Delete task
app.delete("/tasks/:id", (req, res) => {
    db.query("DELETE FROM tasks WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Task deleted" });
    });
});

// 7. Save rating
app.post("/rating", (req, res) => {
    const { date, rating, notes } = req.body;

    const sql = `
        INSERT INTO ratings (date, rating, notes)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE rating = VALUES(rating), notes = VALUES(notes)
    `;

    db.query(sql, [date, rating, notes], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Rating saved" });
    });
});

// -------------------- SERVER --------------------
app.listen(5000, () => console.log("Server running on port 5000"));
