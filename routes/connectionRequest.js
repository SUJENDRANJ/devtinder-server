const { Router } = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  sendConnection,
  reviewConnection,
} = require("../controllers/connectionRequestController");

const router = Router();

router.post("/send/:status/:toUserId", userAuth, sendConnection);
router.post("/review/:status/:requestId", userAuth, reviewConnection);

module.exports = router;
