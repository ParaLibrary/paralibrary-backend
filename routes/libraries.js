var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/").get(function (req, res) {
  const currentUserId = req.session.userId;
  db.libraries.getLibrary(currentUserId, currentUserId).then((library) => {
    if (!library) {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.json(library);
  });
});

router.route("/:id").get(function (req, res) {
  const currentUserId = req.session.userId;
  const targetUserId = req.params.id;
  db.libraries.getLibrary(currentUserId, targetUserId).then((library) => {
    if (!library) {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.json(library);
  });
});

module.exports = router;
