const express = require("express");
const app = express();

const taskRoutes = require("./routes/tasks");
const errorHandler = require("./utils/errorHandler");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/tasks");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

module.exports = app;