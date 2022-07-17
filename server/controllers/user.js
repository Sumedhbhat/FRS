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

const clog = require("../utils/captureLogger");

const fe_file = path.join(
  __dirname,
  "..",
  "face_encodings",
  "face_encodings.json"
);
const pyscripts = path.join(__dirname, "..", "pyscripts");
const recface = path.join(pyscripts, "face_rec.py");

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

  pyres.user_id.forEach((user) => {
    // useEffect(() => {
    //   if (userId && result) {
    //     navigate("/result/?userId=" + userId);
    //     dispatch(reset());
    //   }
    // }, [userId, error, loading]);
    clog(user, "recognized");
  });

  if (!pyres.user_id[0]) {
    clog(img, "unrecognized");
  }

  return res.status(200).json({ users: pyres.user_id, imgpath: imgpath });

  const { errmsg, msg, usr_id } = pyres;

  if (errmsg) {
    // fs.unlinkSync(imgpath);
    return res.status(211).json({ msg: errmsg });
  } else if (msg === "existing user") {
    img = usr_id + extension;
    db.promise()
      .query("CALL record_user_capture(?,?,?)", [img, usr_id, in_out_status])
      .then((result) => {
        fs.renameSync(
          imgpath,
          path.join(capturesFolder, result[0][0][0]["@img_name"])
        );
        var user_name = result[0][0][0]["@user_name"];
        clog(usr_id, "recognized", result[0][0][0]["@user_name"]);
        if (in_out_status == "IN") {
          return res
            .status(211)
            .json({ msg: `Hello ${user_name}!`, user_id: usr_id });
        } else {
          return res
            .status(211)
            .json({ msg: `Bye ${user_name}`, user_id: usr_id });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ msg: err.sqlMessage });
      });
  } else {
    db.promise()
      .query("CALL record_user_capture(?,?,?)", [
        img,
        "unrecognized",
        in_out_status,
      ])
      .catch((err) => {
        console.log(err);
        res.status(400).json({ msg: err.sqlMessage });
      });
    clog(img, "unrecognized");
    return res.status(211).json({ msg: "User Not Recognized" });
  }
};

module.exports = {
  recognizeUser,
};
