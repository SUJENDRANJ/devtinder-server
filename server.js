const express = require("express");
require("dotenv").config();
require("colors");
const configDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/connectionRequest");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://devtinder-developer-u0bu.bolt.host",
    ],

    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", connectionRequestRouter);
app.use("/user", userRouter);

// (async function () {
//   const user = new User({
//     name: "Diana",
//     emailId: "didfddana@gmail.com",
//     password: "Diana@123",
//     age: 16,
//     gender: "female",
//   });
//   await user.save();
// })();

configDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Started at PORT - ${PORT}`.yellow);
    });
  })
  .catch((dbErr) => {
    console.log(`Server Failed ${dbErr}`.red);
  });
