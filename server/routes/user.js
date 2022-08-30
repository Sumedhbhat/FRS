const express = require("express");
const router = express.Router();

const { recognizeUser, attendanceRecognition } = require("../controllers/user");

router.route("/recognizeuser").post(recognizeUser);
router.route("/attendancerecognition").post(attendanceRecognition);

module.exports = router;