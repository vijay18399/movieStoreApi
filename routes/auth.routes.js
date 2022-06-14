const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifySignUp } = require("../middlewares");
// Sign Up route
router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  authController.signup
);
// Sign in route
router.post("/signin", authController.signin);
router.post("/refreshtoken", authController.refreshToken);
module.exports = router;
