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
    let book = req.body;
    db.books.insert(book).then((result) => {
      if (result[0].affectedRows === 0) {    // If no rows are affected, send a 404.
        res.statusCode = 404;
        res.end();
        return
      }
       res.statusCode = 200;
       res.send(result.insertId);
       res.end();
    });
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
    let book = req.body;
    db.books.update(book).then((result) => {
      if (result[0].affectedRows === 0) {    // If no rows are affected, send a 404.
        res.statusCode = 404;
        res.end();
        return;
      }
       res.statusCode = 200;
       res.end();
     });
  })
  .delete(function (req, res) {    
    db.books.delete(req.params.id).then(function (book) {
      res.statusCode = 200; 
    });
  });
    

module.exports = router;
