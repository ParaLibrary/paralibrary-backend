var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/")
  .get(function (req, res) {
    res.statusCode = 200;
    res.json({
      "id": 1,
      "display_name": "BobJoe",
      "name": "Robert Joseph"
    })
  })
  .put(function(req, res) {
    res.statusCode = 200;
    res.end();
  })
  .post(function (req, res) {
    res.statusCode = 200;
      res.json({
      "id": 2,
      "display_name": "Anon421235",
      "name": "Michael Jackson"
    })
  })
  .delete(function(req, res) {
    res.statusCode = 200;
    res.end();
  })

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
    db.users.insertOrUpdate(user).then((result) => {
      if (result.something) {
        // TODO
        res.statusCode = 404;
        return;
      }
      res.statusCode = 200;
    });
  })
  .delete(function (req, res) {
    db.users.delete(req.params.id).then(function (user) {
      // call delete
      //if (user) {   // if user still exists, send an error code
      //  res.statusCode = 404;
      //  return;
      //}
      res.statusCode = 200; //
      //res.json(user);
    });
  });

module.exports = router;
