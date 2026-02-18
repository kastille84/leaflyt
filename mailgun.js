// Load environment variables from .env file
// require("dotenv").config();

// Import necessary modules
const Mailgun = require("mailgun.js");
const formData = require("form-data");
const { keysBasedOnEnv } = require("./server/utility/generalUtils");

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "api",
  key: keysBasedOnEnv().mailgun.apiKey,
});

exports.mailgunClient = client;
