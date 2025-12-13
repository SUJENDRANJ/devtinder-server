const { Router } = require("express");
const {
  allRequests,
  allConnections,
} = require("../controllers/userController");
const { userAuth } = require("../middlewares/auth");

const router = Router();

router.get("/requests/received", userAuth, allRequests);
router.get("/connections", userAuth, allConnections);

module.exports = router;
