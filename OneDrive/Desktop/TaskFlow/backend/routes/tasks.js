const express = require("express");
const router = express.Router();
const c = require("../controllers/taskController");

router.get("/", c.getTasks);
router.post("/", c.createTask);
router.put("/:id/status", c.updateStatus);
router.delete("/:id", c.deleteTask);

module.exports = router;
