const express = require("express");
const router = express.Router();

const loginController  = require("../controllers/login");

router.get("/register", loginController.registerForm);
router.post("/register", loginController.register);

router.get("/login", loginController.loginForm);
router.post("/login", loginController.login);

router.get('/logout',loginController.logout);

router.get('/mock1', loginController.mock1)
//router.get('/', loginController.isLoggedIn, loginController.foo);

module.exports = router;
