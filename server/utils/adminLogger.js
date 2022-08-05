const fs = require("fs");
const path = require("path");
const log_filesFolder = path.join(__dirname, "..", "..", "log_files");
const admin_activity_file = path.join(log_filesFolder, "admin_activity.txt");

function pad(str, len) {
    if(str.length >= len) 
        return str;
    return (str+Array(len).join(" ")).substring(0, len);
}

function alog(adminName, message) {
    var date = pad(new Date().toLocaleString(), 25);
    var datalog = `\n${date}Username: ${pad(adminName, 25)}${message}.`;
    fs.appendFileSync(admin_activity_file, datalog);
}

module.exports = alog;