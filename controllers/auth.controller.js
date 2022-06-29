const db = require("../models");
const { user: User, refreshToken: RefreshToken } = db;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    roles: ["user"],
    password: bcrypt.hashSync(req.body.password, 8),
  });
  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "User was registered successfully!" });
  });
};
exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
      let refreshToken = RefreshToken.createToken(user);
      res.status(200).send({
        id: user._id,
        username: user.username,
        refreshToken: refreshToken,
        email: user.email,
        roles: user.roles,
        accessToken: token,
      });
    });
};
exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }
    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      config.secret,
      {
        expiresIn: config.jwtExpiration,
      }
    );
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
exports.update = (req, res) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    if (user) {
      user.roles = req.body.roles;
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send({ message: "User roles updated successfully!" });
      });
    }
  });
};
exports.getUsers = (req, res) => {
  const perPage = req.query.perPage || 10;
  const currentPage = req.query.page || 1;
  let totalItems;
  User.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return User.find({}, "-password")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((users) => {
      res.status(200).json({ users: users, totalItems: totalItems });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};
exports.getUserCount = (req, res) => {
  User.find()
    .countDocuments()
    .then((count) => {
      res.status(200).json({ user_count: count });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users Count.",
      });
    });
};
