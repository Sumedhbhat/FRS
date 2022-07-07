const express = require("express");
const router = express.Router();

const { recognizeUser } = require("../controllers/user");

router.route("/recognizeuser").post(recognizeUser);

module.exports = router;