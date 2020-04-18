var express = require("express");
var router = express.Router();
var db = require('../db.js');

router.route('/')
  .get(function(req, res) {
    res.statusCode = 200;
    res.json([
      {
        "id": 123,
        "user_id": 1,
        "name": "Horror"
      },
      {
        "id": 129,
        "user_id": 1,
        "name": "My Favorite Books"
      },
      {
        "id": 136,
        "user_id": 1,
        "name": "French... books"
      }
    ])
    .post(function(req, res){
      res.statusCode = 200;
      res.json({
        "id": 140,
        "user_id": 1,
        "name": "Inserted Category"
      })
    })
  })

router.route("/:id")
  .get(function (req, res) {
    res.json({ foo: "GET category" });
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
