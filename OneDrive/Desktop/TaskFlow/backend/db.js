const mysql = require("mysql2");

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

module.exports = db;
