var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/").get(function (req, res) {
  let userId = req.session.userId;
  db.libraries.getUsersLibrary(userId).then((library) => {
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
  db.libraries.getLibraryById(req.params.id).then((user) => {
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
