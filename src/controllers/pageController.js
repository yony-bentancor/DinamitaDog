const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkJWT = require("express-jwt");
const { CLAVE_SECRETA } = require("../config");

const saltRounds = 10;
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

module.exports = {
  showhome: async (req, res) => {
    res.render("index");

    //res.json({  posteos });
  },
};
