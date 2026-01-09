const express = require("express");

const stripeController = require("../controllers/stripe");

const router = express.Router();

router.post("/create-customer", stripeController.createCustomer);

module.exports = router;
