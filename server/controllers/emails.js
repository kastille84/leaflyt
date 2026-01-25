const { mailgunClient } = require("../../mailgun");
const { handleCatchError } = require("../utility/error");
const { keysBasedOnEnv } = require("../utility/generalUtils");

exports.testEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("email", email);
    const data = await mailgunClient.messages.create(
      keysBasedOnEnv().mailgun.domain,
      {
        from: "support@" + keysBasedOnEnv().mailgun.domain,
        to: email,
        subject: "Hello Testing",
        text: "Testing some Mailgun awesomness!",
        html: "<h1>Testing some Mailgun awesomness! How about that?</h1>",
      },
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
      keysBasedOnEnv().mailgun.domain,
      {
        from: "support@" + keysBasedOnEnv().mailgun.domain,
        to: email,
        subject: "Welcome to Leaflit",
        template: `Welcome-${
          typeOfUser === "individual" ? "individual" : "organization"
        }`,
        "v:name": name,
        "v:firstName": firstName,
        "v:lastName": lastName,
        "v:typeOfUser": typeOfUser,
      },
    );
    return res.status(200).json({ data: data });
  } catch (err) {
    console.log("error", err);
    handleCatchError(next, err);
  }
};

exports.sendDeletedUserEmail = async (req, res, next) => {
  try {
    const { email, name, firstName, lastName } = req.body;
    console.log("email", email);
    console.log("name", name);
    console.log("firstName", firstName);
    console.log("lastName", lastName);
    const data = await mailgunClient.messages.create(
      keysBasedOnEnv().mailgun.domain,
      {
        from: "support@" + keysBasedOnEnv().mailgun.domain,
        to: email,
        subject: "Your account has been deleted",
        template: `DeletedUser`,
        "v:name": name,
        "v:firstName": firstName,
        "v:lastName": lastName,
      },
    );
    return res.status(200).json({ data: data });
  } catch (err) {
    console.log("error", err);
    handleCatchError(next, err);
  }
};

exports.sendFlaggedFlyerEmail = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const email = req.body.email;
    const flyer = req.body.flyer;
    const { reason, place } = flyer.flaggedReason;
    console.log("email", email);
    console.log("flaggedReason", flyer.flaggedReason);
    console.log("flyerData", flyer);
    const data = await mailgunClient.messages.create(
      keysBasedOnEnv().mailgun.domain,
      {
        from: "support@" + keysBasedOnEnv().mailgun.domain,
        to: email,
        subject: "Your Flyer was Flagged",
        template: `FlaggedFlyer`,
        "v:reason": reason,
        "v:flyerTitle": flyer.title,
        "v:place": place,
        "v:templateName": flyer.template.templateName,
      },
    );
    return res.status(200).json({ data: data });
  } catch (err) {
    console.log("error", err);
    handleCatchError(next, err);
  }
};
