var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/").get(function (req, res) {
  let users = req.body; //req.session.userId;
  db.libraries.getLibrary(users).then((library) => {
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
  let users = req.params.id;
  db.libraries.getLibraryById(/*req.params.id*/ users).then((library) => {
    if (!user) {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.json(library);
  });
});

module.exports = router;
