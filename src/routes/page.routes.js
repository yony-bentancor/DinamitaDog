const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const pageController = require("../controllers/pageController");

router.get("/", pageController.showhome);

module.exports = router;
