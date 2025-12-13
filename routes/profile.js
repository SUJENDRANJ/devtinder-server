const router = require("express")();
const {
  viewProfile,
  editProfile,
  changePassword,
} = require("../controllers/profileController");
const { userAuth } = require("../middlewares/auth");

router.route("/view").get(userAuth, viewProfile);
router.route("/edit").patch(userAuth, editProfile);
router.route("/change-password").patch(userAuth, changePassword);

module.exports = router;
