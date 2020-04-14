var express = require("express");
var router = express.Router();
var db = require('../db.js');

router.route('/')
  .get(function(req, res) {
    // Get all loans
  })

router.route("/:loan_id")
  .get(function (req, res) {
    res.json({ foo: "GET loan" });
  })
  .put(function (req, res) {})
  .post(function (req, res) {})
  .delete(function (req, res) {});

module.exports = router;
