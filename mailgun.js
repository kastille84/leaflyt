// Load environment variables from .env file
require("dotenv").config();

// Import necessary modules
const Mailgun = require("mailgun.js");
const formData = require("form-data");

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

exports.mailgunClient = client;
