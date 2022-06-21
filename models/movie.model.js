const mongoose = require("mongoose");
const MovieSchema = mongoose.Schema({
  _id: String,
  name: String,
  poster: String,
  lq_poster: String,
  link: String,
  runtime: Number,
  rating: Number,
  votes: Number,
  plot: String,
  audience_rating: String,
  genres: [String],
  actors: [String],
  directors: [String],
  releaseDate: Date,
  year: Number,
  languges: [String],
});

module.exports = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
