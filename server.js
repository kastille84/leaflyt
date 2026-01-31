require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");

// routes
const authRoutes = require("./server/routes/auth");
const assetRoutes = require("./server/routes/assets");
const moderateRoutes = require("./server/routes/moderate");
const emailRoutes = require("./server/routes/emails");
const stripeRoutes = require("./server/routes/stripe");
const {
  deleteFlaggedFlyers,
  deleteExpiredFlyers,
} = require("./server/controllers/flyers");

const app = express();

app.use(cors());
// for handling stripe webhooks
app.use("/webhook", stripeRoutes);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/moderate", moderateRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/stripe", stripeRoutes);

/****  C R O N   J O B S *****/
// cron jobs - delete flagged flyers
cron.schedule("0 5 * * *", () => {
  console.log("running delete Flagged Flyers task at 5am every day");
  deleteFlaggedFlyers();
});

// TODO: turn this on once we've seeded a lot of flyers
// cron jobs - delete old flyers
// cron.schedule("0 5 * * *", () => {
//   console.log("running delete Expired Flyers task at 5am every day");
//   deleteExpiredFlyers();
// });

// general error handling
// catches whenever an error is thrown or forwarded with next()
app.use((error, req, res, next) => {
  console.log("error - ", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  // return res.status(status).json({ message: message, data: data });
  return res.status(status).json({ error });
});

const port = 5000;
app.listen(process.env.PORT || port, () =>
  console.log("Server running on port :" + port),
);
