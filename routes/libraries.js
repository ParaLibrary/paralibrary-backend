var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/").get(function (req, res) {
  const currentUserId = req.session.userId;
  db.libraries
    .getLibrary(currentUserId, currentUserId)
    .then((library) => {
      if (!library) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json(library);
    })
    .catch((error) => {
      res.status(404).end();
    });
});

router.route("/:id").get(function (req, res) {
  const currentUserId = req.session.userId;
  const targetUserId = parseInt(req.params.id);
  if (isNaN(targetUserId)) {
    res.status(400).end();
    return;
  }
  db.libraries
    .getLibrary(currentUserId, targetUserId)
    .then((library) => {
      if (!library) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json(library);
    })
    .catch((error) => {
      res.status(404).end();
    });
});

module.exports = router;
