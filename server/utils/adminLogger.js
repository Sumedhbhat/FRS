const fs = require("fs");
const path = require("path");
const log_filesFolder = path.join(__dirname, "..", "..", "log_files");
const admin_activity_file = path.join(log_filesFolder, "admin_activity.txt");

function pad(str, len) {
    return (str+Array(len).join(" ")).substring(0, len);
}

function alog(adminName, message) {
    var datalog = `\n${new Date().toLocaleString()}\tUsername: ${pad(adminName, 20)}\t${message}.`;
    fs.appendFileSync(admin_activity_file, datalog);
}

module.exports = alog;