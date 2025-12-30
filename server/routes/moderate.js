const express = require("express");

// const assetsController = require("../controllers/assets");
const moderateContoller = require("../controllers/moderate");

const router = express.Router();

router.post("/", moderateContoller.postModerate);

module.exports = router;
