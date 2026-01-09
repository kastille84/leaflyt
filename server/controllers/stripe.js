const { stripe } = require("../../stripe");

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
