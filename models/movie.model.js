const mongoose = require("mongoose");
const MovieSchema = mongoose.Schema({
  _id: String,
  title: String,
  year: Number,
  genres: [String],
  link: String,
  audience_rating: String,
  runtime: String,
  rating: String,
  votes: String,
  plot: String,
  poster: String,
  actors: [String],
  directors: [String],
  releaseDate: Date,
});

module.exports = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
