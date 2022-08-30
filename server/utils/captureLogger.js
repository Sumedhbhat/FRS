const fs = require("fs");
const path = require("path");
const log_filesFolder = path.join(__dirname, "..", "..", "log_files");
const user_capture_file = path.join(log_filesFolder, "user_capture.txt");

function pad(str, len) {
    return (str+Array(len).join(" ")).substring(0, len);
}

function clog(id, rec_stat, name) {
    var date = pad(new Date().toLocaleString(), 25);
    if(rec_stat === "unrecognized") {
        
        var padded = pad(`Img_id:  ${id}`, 55);
        var datalog = `\n${date}${padded}Denied passage through the facial recognition system.`;
        fs.appendFileSync(user_capture_file, datalog);
    }
    else {
        var padded = pad(`User_id: ${id}`, 55);
        var datalog = `\n${date}${padded}${name} was granted passage through the facial recognition system.`;
        fs.appendFileSync(user_capture_file, datalog);
    }
}

module.exports = clog;