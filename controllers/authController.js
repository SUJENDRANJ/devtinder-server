// const bcrypt = require("bcrypt");
const User = require("../models/User");
const { validateSignupData } = require("../utils/validation");
const { generateToken } = require("../config/jwt");

const registerUser = async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // const saltRounds = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, saltRounds); // this or schema.pre

    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password,
      // password: hashedPassword,
    });

    const savedUser = await newUser.save();

    //JWT
    const token = generateToken(savedUser._id);

    //cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //must always be a Date object
      //* maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
    });

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // if (!emailId || !password) throw new Error("No Email or password");

    const existingUser = await User.findOne({ emailId });

    if (!existingUser) throw new Error("Email not Found");

    //* if (!(await bcrypt.compare(password, existingUser.password)))
    //*   throw new Error("Invalid Credentials");

    // validate password
    const isPasswordValid = await existingUser.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid Credentials");

    //cookie & token
    res.cookie("token", generateToken(existingUser._id), {
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ message: "Logged in Successfully", data: existingUser });
  } catch (err) {
    res.status(401).json({
      error: err.message,
    });
  }
};

const logoutUser = async (req, res) => {
  res
    .cookie("token", "", { expires: new Date(0) }) //* expires take object -> new Date(Date(now))
    .json({
      message: req.user.firstName + ", you have Logged out Successfully",
    });
};

module.exports = { registerUser, loginUser, logoutUser };
