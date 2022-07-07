const fs = require("fs");
const path = require("path");
const log_filesFolder = path.join(__dirname, "..", "..", "log_files");
const user_capture_file = path.join(log_filesFolder, "user_capture.txt");

function pad(str, len) {
    return (str+Array(len).join(" ")).substring(0, len);
}

function clog(id, rec_stat, name) {
    if(rec_stat === "unrecognized") {
        var padded = pad(`Img_id:  ${id}`, 50);
        var datalog = `\n${new Date().toLocaleString()}\t${padded}\tDenied passage through the facial recognition system.`;
        fs.appendFileSync(user_capture_file, datalog);
    }
    else {
        var padded = pad(`User_id: ${id}`, 50);
        var datalog = `\n${new Date().toLocaleString()}\t${padded}\t${name} was granted passage through the facial recognition system.`;
        fs.appendFileSync(user_capture_file, datalog);
    }
}

module.exports = clog;