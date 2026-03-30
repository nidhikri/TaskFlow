const db = require("../config/db");

const getTasksByUser = async (userId) => {
    const [rows] = await db.query(
        "SELECT * FROM tasks WHERE user_id = ?",
        [userId]
    );
    return rows;
};

const createTask = async (title, description, userId) => {
    await db.query(
        "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)",
        [title, description, userId]
    );
};

const updateTask = async (id, title, description, userId) => {
    await db.query(
        "UPDATE tasks SET title=?, description=? WHERE id=? AND user_id=?",
        [title, description, id, userId]
    );
};

const deleteTask = async (id, userId) => {
    await db.query(
        "DELETE FROM tasks WHERE id=? AND user_id=?",
        [id, userId]
    );
};

module.exports = {
    getTasksByUser,
    createTask,
    updateTask,
    deleteTask
};