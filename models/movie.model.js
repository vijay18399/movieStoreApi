const mongoose = require("mongoose");
const MovieSchema = mongoose.Schema({
  _id: String,
  name: String,
  year: Number,
  genres: [String],
  link: String,
  audience_rating: Number,
  runtime: Number,
  rating: Number,
  votes: votes,
  plot: String,
  lq_poster: String,
  poster: String,
  actors: [String],
  directors: [String],
  languages: [String],
});

module.exports = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
