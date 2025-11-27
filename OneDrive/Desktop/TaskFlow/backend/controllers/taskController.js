const db = require("../db");

// Get all tasks
exports.getTasks = (req, res) => {
  db.query("SELECT * FROM tasks ORDER BY created_at DESC", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Create task
exports.createTask = (req, res) => {
  const { title, description } = req.body;
  db.query(
    "INSERT INTO tasks (title, description) VALUES (?, ?)",
    [title, description],
    (err) => {
      if (err) throw err;
      res.json({ message: "Task Created" });
    }
  );
};

// Update status
exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE tasks SET status=? WHERE id=?",
    [status, id],
    err => {
      if (err) throw err;
      res.json({ message: "Status Updated" });
    }
  );
};

// Delete task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id=?", [id], err => {
    if (err) throw err;
    res.json({ message: "Task Deleted" });
  });
};
