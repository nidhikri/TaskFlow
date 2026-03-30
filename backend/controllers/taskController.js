const taskModel = require("../models/taskModel");

exports.getTasks = async (req, res) => {
    const tasks = await taskModel.getTasksByUser(req.user.userId);
    res.json({ success: true, data: tasks });
};

exports.createTask = async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    await taskModel.createTask(title, description, req.user.userId);

    res.status(201).json({ message: "Task created" });
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    await taskModel.updateTask(id, title, description, req.user.userId);

    res.json({ message: "Task updated" });
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    await taskModel.deleteTask(id, req.user.userId);

    res.json({ message: "Task deleted" });
};