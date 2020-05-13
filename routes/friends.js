var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/").get(function (req, res) {
  db.friends
    .getAll(req.session.userId)
    .then((friends) => {
      res.status(200).json(friends).end();
    })
    .catch((error) => {
      res.status(404).end();
    });
});

router.route("/:id").post(function (req, res) {
  res.statusCode = 200;

  let friend = req.body; // The front end will pass in the status as raw json data
  if (!friend || !friend.status || req.params.id != friend.id) {
    res.statusCode = 404;
    res.end();
    return;
  }

  switch (friend.status) {
    case "requested":
      db.friends.update(1, friend.id, "requested", "waiting").catch((error) => {
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

router.route("/requested").get(function (req, res) {
  db.friends
    .getAll(req.session.userId)
    .then((friends) => {
      res
        .status(200)
        .json(friends.filter((friend) => friend.status === "requested"))
        .end();
    })
    .catch((error) => {
      res.status(404).end();
    });
});

module.exports = router;
