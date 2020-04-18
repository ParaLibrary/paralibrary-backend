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
  .post(function (req, res) {
    let book = req.body;
    db.books.insertOrUpdate(book).then((result) => {
      /*if (result.something) {    TODO: If something bad happens, send a 404.
        res.statusCode = 404;
        return;
      }*/
      res.statusCode = 200; 
    });
  })
  .delete(function (req, res) {    
    db.books.delete(req.params.id).then(function (book) {
      res.statusCode = 200; 
    });
  });
    

module.exports = router;
