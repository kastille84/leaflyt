const express = require("express");

const emailsController = require("../controllers/emails");

const router = express.Router();

router.post("/test", emailsController.testEmail);

module.exports = router;
