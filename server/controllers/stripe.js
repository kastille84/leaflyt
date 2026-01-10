const { stripe } = require("../../stripe");

// #TODO: - replace with real products
const productsPrice = {
  Garden: process.env.STRIPE_PRODUCT_GARDEN,
  Grove: process.env.STRIPE_PRODUCT_GROVE,
  Forest: process.env.STRIPE_PRODUCT_FOREST,
};

exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await stripe.customers.create({
      name: `${req.body.firstName} ${req.body.lastName}`,
      email: req.body.email,
      address: req.body.address,
    });
    return res.status(200).json({ data: customer });
  } catch (err) {
    next(err);
  }
};

exports.createCheckoutSession = async (req, res, next) => {
  console.log("req.body", req.body);
  const mapPlanToName = {
    1: "Garden",
    2: "Grove",
    3: "Forest",
  };
  console.log("price", productsPrice[mapPlanToName[req.body.plan]]);
  if (!productsPrice[mapPlanToName[req.body.plan]]) {
    return res.status(400).json({ message: "Invalid plan" });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "custom",
      customer: req.body.customerId,
      line_items: [
        {
          price: productsPrice[mapPlanToName[req.body.plan]],
          quantity: 1,
        },
      ],
      mode: "subscription",
      // return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
      return_url: "https://localhost:5173/",
    });
    console.log("session", session);
    return res.status(200).json({ clientSecret: session.client_secret });
  } catch (err) {
    next(err);
  }
};
