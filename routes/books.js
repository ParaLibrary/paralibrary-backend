var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/").post(function (req, res) {
  let book = req.body;
  if (!book || !book.user_id || !book.title) {
    res.status(400).end();
    return;
  }
  db.books
    .insert(book)
    .then(([result, fields]) => {
      if (result.affectedRows === 0) {
        // If no rows are affected, send a 404.
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json({ id: result.insertId });
    })
    .catch((error) => {
      res.status(404).end();
    });
});

router
  .route("/:id")
  .get(function (req, res) {
    db.books.get(req.params.id, req.session.userId).then((book) => {
      if (!book) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json(book);
    });
  })
  .put(function (req, res) {
    let book = req.body;
    db.books
      .update(book)
      .then(([result, fields]) => {
        if (result.affectedRows === 0) {
          res.statusCode = 404;
          res.end();
          return;
        }
        res.status(200).end();
      })
      .catch((error) => {
        res.status(404).end();
      });
  })
  .delete(function (req, res) {
    db.books.delete(req.params.id).then((book) => {
      res.statusCode = 200;
      res.end();
    });
  });

module.exports = router;
