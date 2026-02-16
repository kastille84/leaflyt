// Set your secret key. Remember to switch to your live secret key in production.

const { keysBasedOnEnv } = require("./server/utility/generalUtils");

// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")(keysBasedOnEnv().stripe.secretKey, {
  apiVersion: "2025-12-15.clover",
});

exports.stripe = stripe;
