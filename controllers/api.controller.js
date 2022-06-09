const Movie = require("../models/movie.model");

exports.create = (req, res, next) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Movie content can not be empty",
    });
  }

  if (!req.file) {
    file_url = req.body.file_url;
  } else {
    file_url = "./public/" + req.file.filename;
  }

  movie = new Movie({
    _id: req.body._id,
    title: req.body.title,
    year: req.body.year,
    genres: req.body.genres,
    link: req.body.link,
    audience_rating: req.body.audience_rating,
    runtime: req.body.runtime,
    rating: req.body.rating,
    votes: req.body.votes,
    plot: req.body.plot,
    poster: file_url,
    actors: req.body.actors,
    directors: req.body.directors,
    releaseDate: req.body.releaseDate,
  });
  return movie
    .save()
    .then((data) => {
      res.status(201).json({ data: data, message: "Movie Added successfully" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while Adding the Movie.",
      });
    });
};
exports.findAll = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 12;
  let totalItems;
  Movie.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Movie.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((movies) => {
      res.status(200).json({ movies: movies, totalItems: totalItems });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Movies.",
      });
    });
};
exports.findOne = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return res.status(404).send({
          message: "Movie not found with id " + req.params.movieId,
        });
      }
      res.status(200).json(movie);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Movie not found with id " + req.params.movieId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving movie with id " + req.params.movieId,
      });
    });
};
exports.update = (req, res, next) => {
  const movieId = req.params.movieId;
  Movie.findByIdAndUpdate({ _id: movieId }, req.body, { new: true })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send({
          message: "Movie not found with id " + req.params.movieId,
        });
      }
      res.send(movie);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Movie not found with id " + req.params.movieId,
        });
      }
      return res.status(500).send({
        message: "Error updating movie with id " + req.params.movieId,
      });
    });
};
exports.delete = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return res.status(404).send({
          message: "Movie not found with id " + req.params.movieId,
        });
      }
      res.send({ message: "Movie deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Movie not found with id " + req.params.movieId,
        });
      }
      return res.status(500).send({
        message: "Could not delete movie with id " + req.params.movieId,
      });
    });
};
