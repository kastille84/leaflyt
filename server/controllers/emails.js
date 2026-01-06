const { mailgunClient } = require("../../mailgun");
const { handleCatchError } = require("../utility/error");

exports.testEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("email", email);
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

exports.sendWelcomeEmail = async (req, res, next) => {
  try {
    const { email, typeOfUser, name, firstName, lastName } = req.body;
    console.log("email", email);
    console.log("typeOfUser", typeOfUser);
    console.log("name", name);
    console.log("firstName", firstName);
    console.log("lastName", lastName);
    const data = await mailgunClient.messages.create(
      process.env.MAILGUN_DOMAIN,
      {
        from: "support@" + process.env.MAILGUN_DOMAIN,
        to: email,
        subject: "Welcome to Leaflit",
        template: `Welcome-${
          typeOfUser === "individual" ? "individual" : "organization"
        }`,
        "v:name": name,
        "v:firstName": firstName,
        "v:lastName": lastName,
        "v:typeOfUser": typeOfUser,
      }
    );
    return res.status(200).json({ data: data });
  } catch (err) {
    console.log("error", err);
    handleCatchError(next, err);
  }
};
