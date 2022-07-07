const fs = require("fs");
const path = require("path");
const log_filesFolder = path.join(__dirname, "..", "..", "log_files");
const user_changes_file = path.join(log_filesFolder, "user_changes.txt");

function ulog(user_id, message) {
    var datalog = `\n${new Date().toLocaleString()}\tUser_id: ${user_id}\t${message}.`;
    fs.appendFileSync(user_changes_file, datalog);
}

module.exports = ulog;