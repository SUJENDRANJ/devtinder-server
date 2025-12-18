const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { chatMessages } = require("../controllers/chatController");
const router = express.Router();

router.route("/").post(userAuth, chatMessages);

module.exports = router;
