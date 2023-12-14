const express = require("express");
const app = express();
const { PORT } = require("./config");
const nunjucks = require("nunjucks");
const db = require("./db");
var fs = require("fs");
require("dotenv").config();
const pageRoutes = require("./routes/page.routes");

const nodemailer = require("nodemailer");

nunjucks.configure("./src/views", {
  autoescape: true,
  express: app,
});
db();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", pageRoutes);

app.set("view engine", "njk");
app.use("/static", express.static(__dirname + "/public"));
/*app.use("/public", express.static("${__dirname}/public"));*/

app.listen(PORT, () =>
  console.log(`Servidor corriendo en el puerto de heroku ${PORT}!`)
);
