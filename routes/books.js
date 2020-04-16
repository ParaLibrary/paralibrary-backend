var express = require("express");
var router = express.Router();
var db = require('../db.js');

router.route('/')
  .get(function (req, res) {
    res.statusCode = 200;
    res.json([
      {
        "id": 123,
        "user_id": 1,
        "title": "Test Book Title",
        "author": "An Author Name",
        "isbn": "1234567890123",
        "summary": "The first installment of An Author Name's groundbreaking sci-fi romance novel",
        "visibility": true
      },
      {
        "id": 125,
        "user_id": 1,
        "title": "Test Book 2: Electric Boogaloo",
        "author": "An Author Name",
        "isbn": "1234567890123",
        "summary": "Prepare for round 2 as An Author Name takes you to an imaginary world of wonder",
        "visibility": false
      }
    ])
  })
  .post(function(req, res) {
    res.statusCode = 200;
    res.json({
      "id": 127,
      "user_id": 1,
      "title": "Test Book 3: The Bookening",
      "author": "An Author Name",
      "isbn": "1234567890123",
      "summary": "An Author Name concludes his thrilling horror series with a new age children's book",
      "visibility": true
    })
  })

router.route("/:id")
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
  .put(function (req, res) {
    res.statusCode = 200;
    res.end();
  })
  .delete(function (req, res) {
    res.statusCode = 200;
    res.end();
  });

module.exports = router;
