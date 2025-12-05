const express = require("express");

const assetsController = require("../controllers/assets");

const router = express.Router();

router.delete("/delete", assetsController.deleteAssets);

module.exports = router;
