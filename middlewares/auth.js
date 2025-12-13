const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) throw new Error("Invalid Token, Please Login again!");

    const { _id } = verifyToken(token);

    const user = await User.findOne({ _id }).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { userAuth };
