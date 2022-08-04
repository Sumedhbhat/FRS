const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { spawnSync } = require("child_process");

const db = require("../db/dbconnect");
const user_imagesFolder = path.join(__dirname, "..", "..", "user_images");
const uploadsFolder = path.join(user_imagesFolder, "uploads");
const tempFolder = path.join(user_imagesFolder, "temp");
const deletesFolder = path.join(user_imagesFolder, "deletes");
const capturesFolder = path.join(user_imagesFolder, "captures");
const attendanceFolder = path.join(user_imagesFolder, "attendance");

const clog = require("../utils/captureLogger");

const fe_file = path.join(
  __dirname,
  "..",
  "face_encodings",
  "face_encodings.json"
);
const pyscripts = path.join(__dirname, "..", "pyscripts");
const recface = path.join(pyscripts, "face_rec.py");
const recface_attendance = path.join(pyscripts, "face_rec_attendance.py");

const recognizeUser = async (req, res) => {
  var { base64img, in_out_status } = req.body;

  if (!base64img) {
    return res.status(206).json({ msg: "no image recieved" });
  }

  if (in_out_status != "IN" && in_out_status != "OUT") {
    return res.status(400).send({ msg: "Invalid in_out_status" });
  }

  var extension = "." + base64img.substring(11, base64img.indexOf(";"));
  if (extension !== ".png" && extension !== ".jpeg") {
    return res.status(415).json({ msg: "unsupported filetype" });
  }
  var img = uuidv4() + extension;

  const imgpath = path.join(capturesFolder, img);

  const base64str = base64img.substring(base64img.indexOf(",") + 1);
  fs.writeFileSync(imgpath, base64str, "base64");

  var pyres = 0;

  const process = spawnSync("python3", [recface, imgpath, in_out_status]);
  try {
    pyres = JSON.parse(String(process.stdout).replace(/'/g, '"'));
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ msg: "something went wrong with python script" });
  }

  if (pyres.errmsg) {
    return res.status(211).json({ msg: pyres.errmsg });
  }

  pyres.result.forEach((user) => {
    var {user_id, name} = user;
    clog(user_id, "recognized", name);
  });

  if (!pyres.result[0]) {
    clog(img, "unrecognized");
  }

  return res.status(200).json({ users: pyres.result, imgpath: img });
};

const attendanceRecognition = async (req, res) => {
  var { images } = req.body;

  if(!req.files && !images) {
    return res.status(400).json({msg: 'No images were uploaded.'});
  }

  imgLocs = [];

  if(images) {
    for(var i = 0; i < images.length; i++) {
      var img = images[i];
      var extension = "." + img.substring(11, img.indexOf(";"));
      if (extension !== ".png" && extension !== ".jpeg") {
        return res.status(415).json({ msg: "unsupported filetype" });
      }
      var img = uuidv4() + extension;

      const imgpath = path.join(attendanceFolder, img);

      const base64str = img.substring(img.indexOf(",") + 1);
      fs.writeFileSync(imgpath, base64str, "base64");
      imgLocs.push(img);
    }
  }
  else {
    for (const [key, file] of Object.entries(req.files)) {
      var img = uuidv4() + "." + file.mimetype.split("/")[1];
      const imgpath = path.join(attendanceFolder, img);
      file.mv(imgpath, function (err) {
        if (err) {
          return res.status(500).json({msg: "Something went wrong trying to upload the image"});
        }
      });
      imgLocs.push(img);
    }
  }
  console.log(imgLocs);
  // Changes to be made from here
  var pyres = 0;

  const process = spawnSync("python3", [recface_attendance, imgLocs]);
  try {
    pyres = JSON.parse(String(process.stdout).replace(/'/g, '"'));
  } catch (e) {
      console.log(e);
      console.log(String(process.stderr));
      return res
        .status(400)
        .json({ msg: "something went wrong with python script" });
    }
  // if (pyres.errmsg) {
  //   return res.status(211).json({ msg: pyres.errmsg });
  // }

  // pyres.result.forEach((user) => {
  //   var {user_id, name} = user;
  //   clog(user_id, "recognized", name);
  // });

  // if (!pyres.result[0]) {
  //   clog(img, "unrecognized");
  // }
  return res.status(200).send(pyres);
}

module.exports = {
  recognizeUser,
  attendanceRecognition
};
