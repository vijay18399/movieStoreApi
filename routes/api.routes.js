const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api.controller");
const { upload } = require("../middlewares");
const { authJwt } = require("../middlewares");
//Only admin can Create a new Movie
router.post(
  "/movies",
  [authJwt.verifyToken, authJwt.isAdmin],
  upload.single("poster"),
  apiController.create
);

// Retrieve all movies
router.get("/movies", apiController.findAll);

// Retrieve a single Movie with movieId
router.get("/movies/:movieId", apiController.findOne);

//Either Admin or Moderator can Update Movie with movieId
router.put(
  "/movies/:movieId",
  [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
  apiController.update
);

//Only admin can Delete a Movie with movieId
router.delete(
  "/movies/:movieId",
  [authJwt.verifyToken, authJwt.isAdmin],
  apiController.delete
);

// Search all movies
router.get("/search/:key", apiController.search);

module.exports = router;
