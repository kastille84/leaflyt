const express = require("express");

const stripeController = require("../controllers/stripe");

const router = express.Router();

router.post("/create-customer", stripeController.createCustomer);
router.post("/create-checkout-session", stripeController.createCheckoutSession);

module.exports = router;
