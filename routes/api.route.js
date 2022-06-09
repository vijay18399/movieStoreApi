const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api.controller");
const upload = require("../middlewares/upload");

// Create a new Movie
router.post("/movies", upload.single("poster"), apiController.create);
// Retrieve all movies
router.get("/movies", apiController.findAll);
// Retrieve a single Movie with movieId
router.get("/movies/:movieId", apiController.findOne);
// Update a Movie with movieId
router.put("/movies/:movieId", apiController.update);
// Delete a Movie with movieId
router.delete("/movies/:movieId", apiController.delete);

module.exports = router;
