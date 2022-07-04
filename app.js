const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const db = require("./models");
const routes = require("./routes");
var port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes.api);
app.use("/auth", routes.auth);
app.use("/web", routes.scrap);
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.DB_CONNECTION)
  .then((result) => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
