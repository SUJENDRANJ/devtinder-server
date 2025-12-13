const User = require("../models/User");
const { validateEditData } = require("../utils/validation");

const viewProfile = (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

const editProfile = async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    // console.log(user["firstName"]);

    await loggedInUser.save();

    loggedInUser.password = undefined; //or
    // delete loggedInUser.password; // *not working because JSON object, so
    // const user = loggedInUser.toObject();
    // delete user.password;

    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new Error("Missing Fields");
    }

    const user = req.user;

    if (!(await user.validatePassword(oldPassword)))
      throw new Error("Invalid Credentials");

    if (confirmPassword !== newPassword)
      throw new Error("Password did not match");

    user.password = newPassword;

    await user.save();

    res.status(200).json({ message: "Password updated Successfully" });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { viewProfile, editProfile, changePassword };
