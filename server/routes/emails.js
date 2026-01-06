const express = require("express");

const emailsController = require("../controllers/emails");

const router = express.Router();

// router.post("/test", emailsController.testEmail);
router.post("/send-welcome-email", emailsController.sendWelcomeEmail);

module.exports = router;
