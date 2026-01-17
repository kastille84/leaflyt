const express = require("express");
const bodyParser = require("body-parser");

const stripeController = require("../controllers/stripe");

const router = express.Router();

router.post("/create-customer", stripeController.createCustomer);
router.delete("/delete-customer", stripeController.deleteCustomer);
router.post("/create-checkout-session", stripeController.createCheckoutSession);

router.post(
  "/",
  express.raw({ type: "application/json" }),
  stripeController.webhook
);

module.exports = router;
