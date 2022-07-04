const express = require("express");
const router = express.Router();
const scrapController = require("../controllers/scrap.controller");

// Retrieve a single Movie with movieId
router.get("/scrap/:movieId", scrapController.scrap);
module.exports = router;
