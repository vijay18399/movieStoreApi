const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Role = db.role;
const { TokenExpiredError } = jwt;
const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }
  return res.sendStatus(401).send({ message: "Unauthorized!" });
};
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};
isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.status(403).send({ message: "User Not found." });
    }
    if (user) {
      console.log(user);
      if (user.roles.includes("admin")) {
        next();
        return;
      } else {
        res.status(500).send({ message: err });
        return;
      }
    }
  });
};
isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.status(403).send({ message: "User Not found." });
    }
    if (user) {
      if (user.roles.includes("moderator")) {
        next();
        return;
      } else {
        res.status(500).send({ message: err });
        return;
      }
    }
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
