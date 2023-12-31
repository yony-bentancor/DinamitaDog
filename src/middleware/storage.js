const express = require("express");
const app = express();
const multer = require("multer");
const AWS = require("aws-sdk");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`);
    /*cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)*/
  },
});

const upload = multer({ storage });
module.exports = upload;
