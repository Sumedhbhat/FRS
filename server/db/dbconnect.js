const mysql = require("mysql2");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "sudu_1000" /* "password"  "sudu_1000" */,
  database: "tempdb",
});

module.exports = db;
