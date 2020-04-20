var express = require("express");
var router = express.Router();
var db = require('../db.js');

router.route('/')
  .post(function(req, res) {
    let book = req.body;
    db.books.insert(book).then(([result, fields]) => {
      if (result.affectedRows === 0) {    // If no rows are affected, send a 404.
        res.statusCode = 404;
        res.end();
        return
      }
       res.statusCode = 200;
       res.json({ "id": result.insertId })
    });
  })

router.route("/:id")
  .get(function (req, res) {
    db.books.get(req.params.id).then((book) => {
      if(!book) {
        res.statusCode = 404;
        res.end()
        return;
      }
      res.statusCode = 200;
      res.json(book);
    })
  })
  .put(function (req, res) {
    let book = req.body;
    db.books.update(book).then(([result, fields]) => {
      if (result.affectedRows === 0) {    // If no rows are affected, send a 404.
        res.statusCode = 404;
        res.end();
        return;
      }
       res.statusCode = 200;
       res.json({ "id": result.insertId })
     });
  })
  .delete(function (req, res) {    
    db.books.delete(req.params.id).then((book) => {
      res.statusCode = 200; 
      res.end()
    });
  });
    

module.exports = router;
