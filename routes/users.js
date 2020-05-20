var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/").get(function (req, res) {
  let user = req.body;
  db.users.getById(user).then((user) => {
    if (!user) {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.json(user);
  });
});

router
  .route("/:id")
  .get(function (req, res) {
    let targetId = parseInt(req.params.id);
    if (isNaN(targetId)) {
      res.status(400).end();
      return;
    }
    db.users.getById(req.session.userId, targetId).then((user) => {
      if (!user) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json(user);
    });
  })

  .put(function (req, res) {
    let user = req.body;
    db.users
      .update(user)
      .then(([result, fields]) => {
        if (result.affectedRows == 0) {
          res.statusCode = 404;
          res.end();
          return;
        }
        res.status(200).end();
      })
      .catch((e) => {
        res.status(404).end();
      });
  })

  .delete(function (req, res) {
    if (req.params.id === req.session.userId) {
      db.users
        .delete(req.params.id, req.session.userId)
        .then(() => {
          res.status(200).end();
        })
        .catch((e) => {
          res.status(404).end();
        });
    } else {
      res.statusCode = 403;
      res.end();
    }
  });

router.route("/search/:name").get(function (req, res) {
  db.users.getUserByName(req.session.userId, req.params.name).then((user) => {
    if (!user) {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.json(user);
  });
});

module.exports = router;
