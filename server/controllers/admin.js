const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { spawnSync } = require("child_process");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

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

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "sumedhbhat01@gmail.com", // Admin Gmail ID
    pass: "komnucnnbhczklkt", // Admin Gmail Password
  },
});

const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log(name + "\n" + email + "\n" + password);
    return res.status(206).json({ msg: "insufficient data provided" });
  }

  var hash = bcrypt.hashSync(password, 10);

  db.promise()
    .query("SELECT * FROM admin WHERE email = ?", [email])
    .then(async (result) => {
      if (result[0].length > 0) {
        res.status(206).json({
          msg: "Admin with given email address already exists. Please go to the login page to login.",
        });
      } else {
        const secret = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ email: email }, secret, {
          expiresIn: process.env.REGISTRATION_EXPIRY,
        });
        const link = `http://localhost:${process.env.PORT}/api/admin/activateadmin/${token}`;
        console.log(link);
        try {
          let info = await transporter.sendMail({
            from: "FRS",
            to: email,
            subject: "Your Activation Link",
            text: link,
          });
        } catch (err) {
          console.log(err);
          return res.status(500).json({ msg: "Error sending email" });
        }
        db.promise()
          .query("INSERT INTO admin (name, email, password) VALUE (?, ?, ?)", [
            name,
            email,
            hash,
          ])
          .then(() => {
            alog(name, "Admin created");
            db.execute(
              "INSERT INTO admin_log (change_by, change_on, change_type) VALUE (?, ?, ?)",
              [name, "SELF", "CREATE"]
            );
            res.status(200).json({
              msg: "Admin created, click the activation link sent via email to activate.",
            });
          });
        console.log("here");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.sqlMessage });
    });
};

const generateActivationLink = async (req, res) => {
  const { email } = req.body;

  db.promise()
    .query("SELECT * FROM admin WHERE email = ?", [email])
    .then(async (result) => {
      if (result[0].length === 0)
        return res.status(404).json({ msg: "Admin not found" });
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ email: email }, secret, {
        expiresIn: process.env.REGISTRATION_EXPIRY,
      });
      const link = `http://localhost:${process.env.PORT}/api/admin/activateadmin/${token}`;
      console.log(link);

      try {
        let info = await transporter.sendMail({
          from: "FRS",
          to: email,
          subject: "Your Activation Link",
          text: link,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error sending email" });
      }

      return res
        .status(200)
        .json({ msg: "Activation link sent to your email." });
    });
};

const activateAdmin = async (req, res) => {
  const { token } = req.params;
  var email, expiry;

  try {
    var jwt_decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    email = jwt_decoded.email;
    expiry = jwt_decoded.exp;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Invalid token" });
  }

  if (expiry > new Date().getTime())
    return res
      .status(410)
      .json({ msg: "Registration link expired. Please generate a new link." });

  db.query(
    "SELECT status FROM admin WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: err.sqlMessage });
      }
      if (!result[0]) return res.status(404).json({ msg: "Admin not found" });
      if (result[0].status === "ENABLED")
        return res.status(409).json({ msg: "Admin already verified" });
      db.execute(
        "UPDATE admin SET status = 'ENABLED' WHERE email = ?",
        [email],
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ msg: err.sqlMessage });
          }
          return res.status(200).json({ msg: "Admin activated successfully" });
        }
      );
    }
  );
};

const generateResetLink = async (req, res) => {
  const { email } = req.body;

  db.promise()
    .query("SELECT * FROM admin WHERE email = ?", [email])
    .then(async (result) => {
      if (result[0].length === 0)
        return res.status(404).json({ msg: "Admin not found" });
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ email: email }, secret, {
        expiresIn: process.env.PASSWORD_RESET_EXPIRY,
      });
      const link = `http://localhost:${process.env.PORT}/api/admin/resetpassword/${token}`;
      console.log(link);
      try {
        let info = transporter.sendMail({
          from: "FRS",
          to: email,
          subject: "Your Reset Link",
          text: link,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error sending email" });
      }
      return res
        .status(200)
        .json({ msg: "Password reset link sent to your email." });
    });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPass } = req.body;
  var email, expiry;

  try {
    var jwt_decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    email = jwt_decoded.email;
    expiry = jwt_decoded.exp;
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: "Invalid token" });
  }

  if (expiry > new Date().getTime())
    return res.status(410).json({
      msg: "Password Reset link expired. Please generate a new link.",
    });

  try {
    var hash = bcrypt.hashSync(newPass, 10);
    db.execute("UPDATE admin SET password = ? WHERE email = ?", [hash, email]);
    return res.status(200).json({ msg: "password reset successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.sqlMessage });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(206).json({ msg: "no email provided" });
  }
  if (!password) {
    return res.status(206).json({ msg: "no password provided" });
  }

  db.promise()
    .query("SELECT password, name, status FROM admin WHERE email = ?", [email])
    .then((result) => {
      if (!result[0][0]) {
        alog(" ", `Admin Login attempted with incorrect email: ${email}`);
        res.status(404).json({ msg: "user does not exist" });
      } else if (result[0][0].status === "disabled") {
        alog(result[0][0].name, "Admin Login attempted with disabled account");
        res.status(206).json({
          msg: "account not activated yet. goto OTP page to activate account first",
        });
      } else {
        if (bcrypt.compareSync(password, result[0][0].password)) {
          alog(result[0][0].name, "Admin Login successful");
          db.execute(
            "INSERT INTO admin_log (change_by, change_on, change_type) VALUE (?, ?, ?)",
            [result[0][0].name, "SELF", "LOGIN"]
          );
          const secret = process.env.JWT_SECRET_KEY;
          const token = jwt.sign({ name: result[0][0].name }, secret);
          res.status(200).json({ msg: "login successful", token: token });
        } else {
          alog(
            result[0][0].name,
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
  var { base64img, user_id, last_modified_by } = req.body;

  if (!last_modified_by) {
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
    alog(
      last_modified_by,
      `Unsupported filetype: ${extension} input by the admin`
    );
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

  const process = spawnSync("python3", [recface, imgpath]);
  try {
    // console.log(process);
    console.log(process.stdout);
    pyres = JSON.parse(String(process.stdout).replace(/'/g, '"'));
  } catch (e) {
    console.log(e);
    console.log(String(process.stdout));
    return res
      .status(400)
      .json({ msg: "something went wrong with python script" });
  }

  const { errmsg, msg, usr_id, face_encoding } = pyres;

  if (errmsg) {
    alog(last_modified_by, `Image with ${errmsg} input by the admin`);
    fs.unlinkSync(imgpath);
    return res.status(216).json({ msg: errmsg });
  } else {
    alog(
      last_modified_by,
      `Image with ${msg.substring(
        0,
        msg.indexOf(" ")
      )} user_id: ${usr_id} input by the admin`
    );
    var sts = msg === "existing user" ? 200 : 211;
    return res.status(sts).json({
      msg: msg,
      user_id: usr_id,
      extension: extension,
      face_encoding: face_encoding,
    });
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
  const user_id = req.params.user_id;
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
  const user_id = req.params.user_id;
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
  const user_id = req.params.user_id;
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

const getUserCaptureLog = async (req, res) => {
  db.promise()
    .query("CALL get_capture_log()")
    .then((result) => {
      res.status(200).json(result[0][0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.sqlMessage });
    });
};

const getAdminLog = async (req, res) => {
  const { last_modified_by } = req.body;
  const admin_name = last_modified_by;
  if (!admin_name)
    return res.status(206).json({ msg: "no admin_name provided" });
  db.promise()
    .query(`CALL get_admin_log(?)`, [admin_name])
    .then((result) => {
      res.status(200).json(result[0][0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.sqlMessage });
    });
};

module.exports = {
  createAdmin,
  generateActivationLink,
  activateAdmin,
  generateResetLink,
  resetPassword,
  adminLogin,
  recognizeFace,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getSortedUsers,
  getFilteredUsers,
  getUserCaptureLog,
  getAdminLog,
};
