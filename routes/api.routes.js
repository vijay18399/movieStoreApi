const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api.controller");

const { authJwt } = require("../middlewares");
//Only admin can Create a new Movie
router.post(
  "/movies",
  [authJwt.verifyToken, authJwt.isModerator],
  apiController.create
);

// Retrieve all movies
router.get("/movies", apiController.findAll);

// Retrieve a single Movie with movieId
router.get("/movies/:movieId", apiController.findOne);

//Either Admin or Moderator can Update Movie with movieId
router.put(
  "/movies/:movieId",
  [authJwt.verifyToken, authJwt.isModerator],
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
// filter movies
router.post("/filter", apiController.filter);
// Retrieve all genres
router.get("/genres", apiController.getGenres);
// Retrieve all actors
router.get("/actors", apiController.getActors);
// Retrieve all directors
router.get("/directors", apiController.getDirectors);
// Retrieve all actors or directors
router.get("/recommendations", apiController.getRecommend);
module.exports = router;
