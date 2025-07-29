const express = require("express");

const authController = require("../controllers/auth");

const { email, password } = require("../middlewares/validators/auth");

const router = express.Router();

router.post(
  "/signup",
  // [email("email"), password("password")],
  authController.signup
);
router.post(
  "/login",
  [email("email"), password("password")],
  authController.login
);

module.exports = router;
