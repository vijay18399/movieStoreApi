const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.movie = require("./movie.model");
db.refreshToken = require("./refreshToken.model");
db.ROLES = ["user", "admin", "moderator"];
module.exports = db;
