const db = require("../models");
const Movie = db.movie;

exports.create = (req, res, next) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Movie content can not be empty",
    });
  }

  movie = new Movie({
    _id: req.body._id,
    name: req.body.name,
    poster: req.body.poster,
    lq_poster: req.body.lq_poster,
    link: req.body.link,
    runtime: req.body.runtime,
    rating: req.body.rating,
    votes: req.body.votes,
    plot: req.body.plot,
    audience_rating: req.body.audience_rating,
    genres: req.body.genres,
    actors: req.body.actors,
    directors: req.body.directors,
    year: req.body.year,
    languges: req.body.languges,
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
  const perPage = req.query.perPage || 12;
  const currentPage = req.query.page || 1;
  const sortBy = req.query.sortBy || 0;
  const asc = req.query.asc || 1;
  const noYear = req.query.noYear || 1;
  console.log(req.query);
  var filter = {};
  if (noYear) {
    filter = { year: { $ne: 0 } };
  }
  sortby = {};
  if (sortBy == "name") {
    sortby = { sort: { name: asc } };
  }
  if (sortBy == "year") {
    sortby = { sort: { year: asc } };
  }
  console.log(filter);
  let totalItems;
  Movie.find(filter, null, sortby)
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Movie.find(filter, null, sortby)
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
exports.filter = (req, res, next) => {
  const perPage = req.query.perPage || 12;
  const currentPage = req.query.page || 1;
  const sortBy = req.query.sortBy || 0;
  const asc = req.query.asc || 1;
  sortby = {};
  if (sortBy == "name") {
    sortby = { sort: { name: asc } };
  }
  if (sortBy == "year") {
    sortby = { sort: { year: asc } };
  }
  let query = {
    $and: [
      { genres: { $in: req.body.genres } },
      { languages: { $in: req.body.languages } },
    ],
  };
  let totalItems;
  Movie.find(query, null, sortby)
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Movie.find(query, null, sortby)
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
exports.search = (req, res, next) => {
  console.log(req.params);
  console.log(req.query);
  const re = new RegExp(req.params.key, "i");
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 12;
  const searchFor = req.query.searchFor || "name";
  let filter = {};
  let totalItems;
  if (searchFor == "name") {
    filter = { name: { $regex: req.params.key, $options: "i" } };
  } else if (searchFor == "actors") {
    filter = { actors: { $in: [re] } };
  } else {
    filter = { directors: { $in: [re] } };
  }
  console.log(filter);
  Movie.find(filter)
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Movie.find(filter)
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
exports.getGenres = (req, res, next) => {
  const key = req.query.key || "";
  Movie.distinct("genres", { type: 1, genres: { $regex: key, $options: "i" } })
    .then((genres) => {
      res.status(200).json({ genres: genres });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Genres.",
      });
    });
};
exports.getActors = (req, res, next) => {
  const key = req.query.key || "";
  Movie.distinct("actors", {
    type: 1,
    actors: { $regex: key, $options: "i" },
  })
    .then((actors) => {
      res.status(200).json({ actors: actors });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Actors.",
      });
    });
};
exports.getDirectors = (req, res, next) => {
  const key = req.query.key || "";
  Movie.distinct("directors", {
    type: 1,
    directors: { $regex: key, $options: "i" },
  })
    .then((directors) => {
      res.status(200).json({ directors: directors });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Directors.",
      });
    });
};
exports.getRecommend = (req, res, next) => {
  const key = req.query.key || "";
  let actors = Movie.distinct("actors", {
    type: 1,
    actors: { $regex: key, $options: "i" },
  });
  let directors = Movie.distinct("directors", {
    type: 1,
    directors: { $regex: key, $options: "i" },
  });
  Promise.all([actors, directors]).then((values) => {
    let recommendations = values[0].concat(values[1]);
    res.status(200).json({ recommendations: recommendations });
  });
};
exports.getMovieCount = (req, res) => {
  Movie.find()
    .countDocuments()
    .then((count) => {
      res.status(200).json({ movie_count: count });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Movies Count.",
      });
    });
};
