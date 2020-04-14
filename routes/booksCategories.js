var express = require("express");
var router = express.Router();
var db = require('../db.js');

router.route('/')
  .get(function(req, res) {
    // Get all book categories
  })

router.route("/:id")
  .get(function (req, res) {
    res.json({ foo: "GET book category" });
  })
  .put(function (req, res) {})
  .post(function (req, res) {})
  .delete(function (req, res) {});

module.exports = router;
