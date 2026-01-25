// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_TEST, {
  apiVersion: "2025-12-15.clover",
});

exports.stripe = stripe;
