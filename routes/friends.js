var express = require("express");
var router = express.Router();
var db = require("../db.js");

router
  .route("/")
  .get(function (req, res) {
    db.friends.get(req.session.userId).then((friend) => {
      if (!friend) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json(friend);
    });
  })
  .post(function (req, res) {
    res.statusCode = 200;
    let friend = req.body;
    if (!friend || !friend.status || req.params.id != friend.id) {
      res.statusCode = 404;
      res.end();
      return;
    }

    switch (friend.status) {
      case "requested":
        db.friends
          .update(1, friend.id, "requested", "waiting")
          .catch((error) => {
            res.body = error;
            res.statusCode = 404;
          });
        break;
      case "accepted":
        db.friends.update(1, friend.id, "friends", "friends").catch((error) => {
          res.body = error;
          res.statusCode = 404;
        });
        break;
      case "rejected":
        db.friends.delete(1, friend.id).catch((error) => {
          res.body = error;
          res.statusCode = 404;
        });
        break;
      default:
        res.statusCode = 404;
    }

    res.end();
  });

module.exports = router;
