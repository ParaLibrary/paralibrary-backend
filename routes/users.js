var express = require("express");
var router = express.Router();
var db = require("../db.js");

router
  .route("/")
  .get(function (req, res) {
    // Get all users
  })
  .post(function (req, res) {
    
  });

router
  .route("/:id")
  .get(function (req, res) {
    db.users.get(req.params.id).then(function (user) {
      if (!user) {
        res.statusCode = 404;
        return;
      }
      res.statusCode = 200;
      res.json(user);
    });
  })
  .put(function (req, res) {
    let user = req.body;
    db.users.update(user).then((result) => {
      /*if (result.something) {    TODO: If something bad happens, send a 404.
        res.statusCode = 404;
        return;
      }*/
       res.statusCode = 200;
       res.end();
     });
  })
  .delete(function (req, res) {
    db.users.delete(req.params.id).then(function (user) {
      res.statusCode = 200;
    });
  });

module.exports = router;
