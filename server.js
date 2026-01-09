require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// routes
const authRoutes = require("./server/routes/auth");
const assetRoutes = require("./server/routes/assets");
const moderateRoutes = require("./server/routes/moderate");
const emailRoutes = require("./server/routes/emails");
const stripeRoutes = require("./server/routes/stripe");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/moderate", moderateRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/stripe", stripeRoutes);

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
  console.log("Server running on port :" + port)
);
