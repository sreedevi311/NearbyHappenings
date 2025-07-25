const express = require("express");
const router = express.Router();
const authMiddleware=require('../middleware/auth.middleware')
const authController = require("../controllers/auth.controller");

router.get('/profile',authMiddleware,authController.profile)
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authMiddleware,authController.logout);
router.put('/update-preferences', authMiddleware,authController.updateUserPreferences);

module.exports = router;
