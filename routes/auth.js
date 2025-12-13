const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.route("/signup").post(registerUser); // pass middleware(registerUser) only, not path(/any)
router.post("/login", loginUser);
router.post("/logout", userAuth, logoutUser);

module.exports = router;
