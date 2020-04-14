var express = require("express");
var router = express.Router();
var db = require('../db.js');

router
  .route("/:id")
  .get(function (req, res) {
    db.books.get(req.params.id)
    .then(function(book) {
      if(!book) {
        res.statusCode = 404;
        return;
      }
      res.statusCode = 200;
      res.json(book);
    })
  })
  .put(function (req, res) {})
  .post(function (req, res) {})
  .delete(function (req, res) {});

module.exports = router;
