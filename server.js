const express = require("express");
require("dotenv").config();
require("colors");
const configDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/connectionRequest");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://devtinder-site.netlify.app"],

    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", connectionRequestRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);

// socket.io
const server = http.createServer(app);
initializeSocket(server);

configDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server Started at PORT - ${PORT}`.yellow);
    });
  })
  .catch((dbErr) => {
    console.log(`Server Failed ${dbErr}`.red);
  });
