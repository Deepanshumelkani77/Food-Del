const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const { protect } = require("../middleware/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);


module.exports = router;
