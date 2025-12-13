const { Router } = require("express");
const {
  allRequests,
  allConnections,
  feed,
} = require("../controllers/userController");
const { userAuth } = require("../middlewares/auth");

const router = Router();

router.get("/requests/received", userAuth, allRequests);
router.get("/connections", userAuth, allConnections);
router.get("/feed", userAuth, feed);

module.exports = router;
