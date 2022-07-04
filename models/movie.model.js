const mongoose = require("mongoose");
const MovieSchema = mongoose.Schema({
  _id: String,
  name: String,
  year: Number,
  genres: [String],
  link: String,
  audience_rating: String,
  runtime: Number,
  rating: Number,
  votes: Number,
  plot: String,
  lq_poster: String,
  poster: String,
  actors: [String],
  directors: [String],
  languages: [String],
});

module.exports = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
