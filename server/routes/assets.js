const express = require("express");

const assetsController = require("../controllers/assets");

const router = express.Router();

router.delete("/delete", assetsController.deleteAssets);
router.delete("/delete-all", assetsController.deleteAllAssetsFromUser);

module.exports = router;
