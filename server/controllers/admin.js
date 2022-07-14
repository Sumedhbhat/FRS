const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { spawnSync } = require("child_process");

const db = require("../db/dbconnect");
const filterFiller = require("../utils/filter");
const alog = require("../utils/adminLogger");
const ulog = require("../utils/userLogger");

const user_imagesFolder = path.join(__dirname, "..", "..", "user_images");
const uploadsFolder = path.join(user_imagesFolder, "uploads");
const tempFolder = path.join(user_imagesFolder, "temp");
const deletesFolder = path.join(user_imagesFolder, "deletes");
const capturesFolder = path.join(user_imagesFolder, "captures");

const fe_file = path.join(
  __dirname,
  "..",
  "face_encodings",
  "face_encodings.json"
);
const pyscripts = path.join(__dirname, "..", "pyscripts");
const recface = path.join(pyscripts, "recface.py");

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(206).json({ msg: "no username provided" });
  }
  if (!password) {
    return res.status(206).json({ msg: "no password provided" });
  }

  db.promise()
    .query("SELECT password FROM admin WHERE username = ?", [username])
    .then((result) => {
      if (!result[0][0]) {
        alog("", `Admin Login attempted with incorrect username: ${username}`);
        res.status(404).json({ msg: "user does not exist" });
      } else {
        if (password === result[0][0].password) {
          alog(username, "Admin Login successful");
          res.status(200).json({ msg: "login successful" });
        } else {
          alog(
            username,
            `Admin Login attempted with incorrect password: ${password}`
          );
          res.status(422).json({ msg: "login unsuccessful" });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.sqlMessage });
    });
};

const recognizeFace = async (req, res) => {
  var { base64img, user_id, admin } = req.body;

  if (!admin) {
    return res.status(206).json({ msg: "insufficient data provided" });
  }

  if ((!req.files || !req.files.base_img) && !base64img) {
    return res.status(206).json({ msg: "no image recieved" });
  }
  var extension = ".";
  if (req.files && req.files.base_img) {
    extension += req.files.base_img.mimetype.substring(6);
  } else {
    extension += base64img.substring(11, base64img.indexOf(";"));
  }
  if (extension !== ".png" && extension !== ".jpeg") {
    alog(username, `Unsupported filetype: ${extension} input by the admin`);
    return res.status(415).json({ msg: "unsupported filetype" });
  }

  if (!user_id) {
    user_id = uuidv4();
  }

  const imgpath = path.join(tempFolder, user_id + extension);

  if (base64img) {
    const base64str = base64img.substring(base64img.indexOf(",") + 1);
    fs.writeFileSync(imgpath, base64str, "base64");
  } else {
    fs.writeFileSync(imgpath, req.files.base_img.data);
  }

  var pyres = 0;

  const process = spawnSync("python3", [recface, imgpath, "admin"]);
  try {
    pyres = JSON.parse(String(process.stdout).replace(/'/g, '"'));    
  }
  catch(e) {
    console.log(e);
    return res.status(400).json({msg:"something went wrong with python script"});
  }

  const {errmsg, msg, usr_id, face_encoding} = pyres;

  if(errmsg) {
    alog(admin, `Image with ${errmsg} input by the admin`);
    fs.unlinkSync(imgpath);
    return res.status(216).json({msg: errmsg});
  }
  else {
    alog(admin, `Image with ${msg.substring(0, msg.indexOf(" "))} user_id: ${usr_id} input by the admin`);
    var sts = msg === "existing user" ? 200 : 211;
    return res.status(sts).json({msg: msg, user_id: usr_id, extension: extension, face_encoding: face_encoding})
  }
};

const createUser = async (req, res) => {
  const {
    user_id,
    name,
    mob_no,
    gender,
    city,
    department,
    last_modified_by,
    extension,
    face_encoding,
  } = req.body;
  const base_img = user_id + extension;
  if (
    !user_id ||
    !name ||
    !mob_no ||
    !gender ||
    !city ||
    !department ||
    !last_modified_by ||
    !extension ||
    !face_encoding
  ) {
    return res.status(206).json({ msg: "insufficient data provided" });
  }

  db.promise()
    .query(
      "INSERT INTO user (user_id, base_img, img_ext, name, mob_no, gender, city, department, last_modified_by) VALUE (?,?,?,?,?,?,?,?,?)",
      [
        user_id,
        base_img,
        extension,
        name,
        mob_no,
        gender,
        city,
        department,
        last_modified_by,
      ]
    )
    .then(() => {
      fs.renameSync(
        path.join(tempFolder, base_img),
        path.join(uploadsFolder, base_img)
      );
      var fe_data = fs.readFileSync(fe_file);
      fe_data = JSON.parse(fe_data);
      fe_data[user_id] = face_encoding;
      fe_data = JSON.stringify(fe_data)
        .replaceAll("],", "],\n")
        .replaceAll("{", "{\n")
        .replaceAll("}", "\n}");
      fs.writeFileSync(fe_file, fe_data);
      alog(last_modified_by, `Admin created user with user_id: ${user_id}`);
      ulog(user_id, `User created`);
      res
        .status(200)
        .json({ msg: `User Created Successfully with user id: ${user_id}` });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: err.sqlMessage });
    });
};

const updateUser = async (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) {
    return res.status(200).json({ msg: "no user_id provided" });
  }
  const {
    name,
    mob_no,
    gender,
    city,
    department,
    extension,
    last_modified_by,
    face_encoding,
  } = req.body;
  if (
    !name ||
    !mob_no ||
    !gender ||
    !city ||
    !department ||
    !last_modified_by
  ) {
    return res.status(206).json({ msg: "insufficient data provided" });
  }
  if (extension) {
    const base_img = user_id + extension;
    var errormsg = "";
    db.execute(
      "SELECT base_img FROM user WHERE user_id = ?",
      [user_id],
      (err, result) => {
        if (err) {
          errormsg = err.sqlMessage;
        } else if (base_img !== result[0].base_img) {
          fs.unlinkSync(path.join(uploadsFolder, result[0].base_img));
        }
      }
    );
    if (errormsg !== "") {
      return res.status(500).json({ msg: err.sqlMessage });
    }
    db.promise()
      .query(
        "UPDATE user SET base_img = ?, img_ext = ?, name = ?, mob_no = ?, gender = ?, city = ?, department = ?, last_modified_by = ? WHERE user_id = ?",
        [
          base_img,
          extension,
          name,
          mob_no,
          gender,
          city,
          department,
          last_modified_by,
          user_id,
        ]
      )
      .then(() => {
        fs.renameSync(
          path.join(tempFolder, base_img),
          path.join(uploadsFolder, base_img)
        );
        var fe_data = fs.readFileSync(fe_file);
        fe_data = JSON.parse(fe_data);
        fe_data[user_id] = face_encoding;
        fe_data = JSON.stringify(fe_data)
          .replaceAll("],", "],\n")
          .replaceAll("{", "{\n")
          .replaceAll("}", "\n}");
        fs.writeFileSync(fe_file, fe_data);
        alog(last_modified_by, `Admin updated user with user_id: ${user_id}`);
        ulog(user_id, `User details updated`);
        res.status(200).json({ msg: `User Updated Successfully` });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: err.sqlMessage });
      });
  } else {
    db.promise()
      .query(
        "UPDATE user SET name = ?, mob_no = ?, gender = ?, city = ?, department = ?, last_modified_by = ? WHERE user_id = ?",
        [name, mob_no, gender, city, department, last_modified_by, user_id]
      )
      .then(() => {
        alog(last_modified_by, `Admin updated user with user_id: ${user_id}`);
        ulog(user_id, `User details updated`);
        res.status(200).json({ msg: `User Updated Successfully` });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: err.sqlMessage });
      });
  }
};

const deleteUser = async (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) {
    return res.status(206).json({ msg: "no user_id provided" });
  }

  const { last_modified_by } = req.body;
  if (!last_modified_by) {
    return res.status(206).json({ msg: "insufficient data provided" });
  }

  db.promise()
    .query("CALL delete_user(?, ?)", [user_id, last_modified_by])
    .then((result) => {
      fs.renameSync(
        path.join(uploadsFolder, result[0][0][0].base_img),
        path.join(deletesFolder, result[0][0][0].base_img)
      );
      var fe_data = fs.readFileSync(fe_file);
      fe_data = JSON.parse(fe_data);
      delete fe_data[user_id];
      fe_data = JSON.stringify(fe_data)
        .replaceAll("],", "],\n")
        .replaceAll("{", "{\n")
        .replaceAll("}", "\n}");
      fs.writeFileSync(fe_file, fe_data);
      alog(last_modified_by, `Admin deleted user with user_id: ${user_id}`);
      ulog(user_id, `User deleted`);
      res.status(200).json({ msg: "User Deleted Successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.sqlMessage });
    });
};

const getUser = async (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) {
    return res.status(206).json({ msg: "no user_id provided" });
  }

  db.promise()
    .query("SELECT * FROM get_user WHERE user_id = ?", [user_id])
    .then((result) => {
      if (!result[0][0]) {
        res.status(400).json({ msg: "user does not exist" });
      } else {
        result[0][0].date_created = String(result[0][0].date_created).substring(
          4,
          15
        );
        res.status(200).json(result[0][0]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.sqlMessage });
    });
};

const getUsers = async (req, res) => {
  db.promise()
    .query("SELECT * FROM get_user ORDER BY date_created DESC LIMIT 20")
    .then((result) => {
      if (!result[0][0]) {
        res.status(400).json({ msg: "no users in the db" });
      } else {
        result[0].forEach((user) => {
          user.date_created = String(user.date_created).substring(4, 15);
        });
        res.status(200).json(result[0]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.sqlMessage });
    });
};

const getSortedUsers = async (req, res) => {
  var { col_name, sort_order } = req.body;
  if (!col_name) return res.status(206).json({ msg: "no col_name provided" });
  if (sort_order === "ascending") sort_order = "";
  else if (sort_order === "descending") sort_order = "DESC";
  else return res.status(415).json({ msg: "invalid sort order request" });

  db.promise()
    .query(`SELECT * FROM get_user ORDER BY ?? ${sort_order}`, [col_name])
    .then((result) => {
      if (!result[0][0]) {
        res.status(400).json({ msg: "no users in the db" });
      } else {
        result[0].forEach((user) => {
          user.date_created = String(user.date_created).substring(4, 15);
        });
        res.status(200).json(result[0]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.sqlMessage });
    });
};

const getFilteredUsers = async (req, res) => {
  var { name, gender, city, department, date_created } = filterFiller(req.body);
  db.promise()
    .query(
      `SELECT * FROM user WHERE name IN (${name}) AND gender IN (${gender}) AND city IN (${city}) AND department IN (${department}) AND date_created ${date_created}`
    )
    .then((result) => {
      if (!result[0][0]) {
        res.status(210).json({ msg: "no users match the criteria" });
      } else {
        result[0].forEach((user) => {
          user.date_created = String(user.date_created).substring(4, 15);
        });
        res.status(200).json(result[0]);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.sqlMessage });
    });
};

module.exports = {
  adminLogin,
  recognizeFace,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getSortedUsers,
  getFilteredUsers,
};
