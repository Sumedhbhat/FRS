const mysql = require("mysql2");
const {user, host, password, database} = require("./db_config");

const db = mysql.createConnection({
  user: user,
  host: host,
  password: password,  /* "password" "sudu_1000" */
  database: database,
});

module.exports = db;
