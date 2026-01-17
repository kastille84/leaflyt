const { stripe } = require("../../stripe");
const { supabase } = require("../../supabase");

// #TODO: - replace with real products
const productsPrice = {
  Garden: process.env.STRIPE_PRODUCT_GARDEN,
  Grove: process.env.STRIPE_PRODUCT_GROVE,
  Forest: process.env.STRIPE_PRODUCT_FOREST,
};

const mapPlanToName = {
  1: "Seed",
  2: "Garden",
  3: "Grove",
  4: "Forest",
};

exports.createCustomer = async (req, res, next) => {
  try {
    // create customer in Stripe
    const customer = await stripe.customers.create({
      name: `${req.body.firstName} ${req.body.lastName}`,
      email: req.body.email,
      address: req.body.address,
    });

    console.log("createCustomer", customer);
    // create customer in supabase
    const { customerData, error } = await supabase.from("customers").insert([
      {
        customerId: customer.id,
        user: req.body.userId,
      },
    ]);
    return res.status(200).json({ data: customer });
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  // get customerId from the headers
  const customerId = req.headers.customerid;
  try {
    // delete customer in Stripe
    // This function will permanently delete the customer
    // and immediately cancel any active subscriptions associated with them
    const customer = await stripe.customers.del(customerId);
    console.log("deleteCustomer", customer);
    // delete customer in supabase
    const { customerData, error } = await supabase
      .from("customers")
      .delete()
      .eq("customerId", customerId);
    return res.status(200).json({ data: customer });
  } catch (err) {
    next(err);
  }
};

exports.createCheckoutSession = async (req, res, next) => {
  console.log("req.body", req.body);

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
          metadata: {
            friendlyPlanId: req.body.plan,
            friendlyPlanName: mapPlanToName[req.body.plan],
          },
        },
      ],
      mode: "subscription",
      // return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
      return_url:
        // TODO: - replace with real url
        "https://localhost:5173/dashboard/home?session_id={CHECKOUT_SESSION_ID}&customer_id=" +
        req.body.customerId +
        "&plan=" +
        req.body.plan,
    });
    console.log("session", session);
    return res
      .status(200)
      .json({ ...session, clientSecret: session.client_secret });
  } catch (err) {
    next(err);
  }
};

exports.webhook = async (req, res, next) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    console.log(`⚠️  Webhook signature verification failed.`);
    console.log(`⚠️  Check the env file and enter the correct webhook secret.`);
    return res.sendStatus(400);
  }
  // Extract the object from the event.
  const dataObject = event.data.object;

  // Handle the event
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample
  switch (event.type) {
    case "invoice.paid":
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      console.log("invoice.paid", dataObject);
      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer doesn't have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      console.log("invoice.payment_failed", dataObject);
      break;
    case "customer.subscription.created":
      if (event.request != null) {
        console.log("customer.subscription.created", dataObject);
        console.log(
          "customer.subscription.created - items - data",
          dataObject.items.data
        );
        const subscriptionId = dataObject.id;
        const productId = dataObject.plan.product;
        const priceId = dataObject.plan.id;
        const customerId = dataObject.customer;
        const status = dataObject.status;
        // update subabscription in supabase
        try {
          const { data, error } = await supabase
            .from("customers")
            .update({
              subscriptionId: subscriptionId,
              subscriptionStatus: status,
              productId: productId,
            })
            .eq("customerId", customerId);
        } catch (err) {
          next(err);
        }
      }
      break;
    case "customer.subscription.paused":
      if (event.request != null) {
        console.log("customer.subscription.paused", dataObject);
      }
      break;
    case "customer.subscription.resumed":
      if (event.request != null) {
        console.log("customer.subscription.resumed", dataObject);
      }
      break;
    case "customer.subscription.updated":
      if (event.request != null) {
        console.log("customer.subscription.updated", dataObject);
      }
      break;
    case "customer.subscription.deleted":
      if (event.request != null) {
        // handle a subscription canceled by your request
        // from above.
      } else {
        // handle subscription canceled automatically based
        // upon your subscription settings.
      }
      break;
    default:
    // Unexpected event type
  }
  res.sendStatus(200);
};
