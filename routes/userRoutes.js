const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// register user
router.post("/register", userController.registrate_user);
// login user
router.post("/login", userController.login_user);
//get user
router.post("/getUser", userController.get_user);

router.get("/allUsers/:id", userController.get_all_users);

module.exports = router;