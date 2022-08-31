const mysql = require("mysql2");
const {user, host, password, database} = require("./db_config");

const db = mysql.createConnection({
  user: "vedanta",
  host: "localhost",
  password: "vedu123",  /* "password" "sudu_1000" */
  database: "FRS",
});

module.exports = db;
