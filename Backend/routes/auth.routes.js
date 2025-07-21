const express = require("express");
const router = express.Router();
const auth=require('../middleware/auth.middleware')
const authController = require("../controllers/auth.controller");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.put('/update-preferences', auth,authController.updateUserPreferences);

module.exports = router;
