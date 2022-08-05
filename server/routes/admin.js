const express = require("express");
const router = express.Router();

const {
  recognizeFace,
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

router.route("/login").post(adminLogin);
router.route("/recognizeface").post(recognizeFace);
router.route("/users/create").post(createUser);
router.route("/dashboard").get(getUsers);
router.route("/users/sort").post(getSortedUsers);
router.route("/users/capturelog").get(getUserCaptureLog);
router.route("/adminlog").post(getAdminLog);
router
  .route("/users/:user_id?")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
router.route("/users/search").post(getFilteredUsers);

module.exports = router;
