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

router
  .route("/:id")
  .get(function (req, res) {
    db.friends
      .getAll(req.session.userId)
      .then((friends) => {
        res.status(200).json(friends).end();
      })
      .catch((error) => {
        res.status(404).end();
      });
  })

  .post(function (req, res) {
    let friendshipChange = req.body; // The front end will pass in the status as raw json data
    if (
      !friendshipChange ||
      !friendshipChange.action ||
      req.params.id != friendshipChange.id
    ) {
      res.statusCode = 400;
      res.end();
      return;
    }

    const currentId = req.session.userId;

    switch (friendshipChange.action) {
      case "request":
        db.friends
          .update(currentId, friendshipChange.id, "requested", "waiting")
          .then(() => {
            res.status(200).end();
          })
          .catch((error) => {
            res.body = error;
            res.status(404).end();
          });
        break;
      case "accept":
        db.friends
          .update(currentId, friendshipChange.id, "friends", "friends")
          .then(() => {
            res.status(200).end();
          })
          .catch((error) => {
            res.body = error;
            res.status(404).end();
          });
        break;
      case "reject":
        db.friends
          .delete(currentId, friendshipChange.id)
          .then(() => {
            res.status(200).end();
          })
          .catch((error) => {
            res.body = error;
            res.status(404).end();
          });
        break;
      default:
        res.status(400).end();
    }
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
