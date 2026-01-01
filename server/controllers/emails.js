const { mailgunClient } = require("../../mailgun");
const { handleCatchError } = require("../utility/error");

exports.testEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("email", email);
    console.log("process.env.MAILGUN_DOMAIN", process.env.MAILGUN_DOMAIN);
    const data = await mailgunClient.messages.create(
      process.env.MAILGUN_DOMAIN,
      {
        from: "support@" + process.env.MAILGUN_DOMAIN,
        to: email,
        subject: "Hello Testing",
        text: "Testing some Mailgun awesomness!",
        html: "<h1>Testing some Mailgun awesomness! How about that?</h1>",
      }
    );
    return res.status(200).json({ data: data });
  } catch (err) {
    console.log("error", err);
    handleCatchError(next, err);
  }
};
