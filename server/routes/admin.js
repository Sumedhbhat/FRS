const express = require("express");
const router = express.Router();
const checkUserAuth = require("../utils/checkUserAuth");

const {
  recognizeFace,
  createAdmin,
  generateActivationLink,
  activateAdmin,
  generateResetLink,
  resetPassword,
  adminLogin,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getSortedUsers,
  getFilteredUsers,
  getUserCaptureLog,
  getAdminLog,
} = require("../controllers/admin");

router.use("/recognizeface", checkUserAuth);
router.use("/users/create", checkUserAuth);
router.use("/users/:user_id", checkUserAuth);
router.use("/adminlog", checkUserAuth);


router.route("/createadmin").post(createAdmin);
router.route("/generateactivationlink").post(generateActivationLink);
router.route("/activateadmin/:token").get(activateAdmin);
router.route("/generateresetlink").post(generateResetLink);
router.route("/resetpassword/:token").post(resetPassword);
router.route("/login").post(adminLogin);
router.route("/recognizeface").post(recognizeFace);
router.route("/users/create").post(createUser);
router.route("/dashboard").get(getUsers);
router.route("/users/sort").post(getSortedUsers);
router.route("/users/capturelog").get(getUserCaptureLog);
router.route("/adminlog").post(getAdminLog);
router
  .route("/users/:user_id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
router.route("/users/search").post(getFilteredUsers);

module.exports = router;
