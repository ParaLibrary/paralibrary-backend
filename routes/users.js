var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/")
  .post(function (req, res) {
    let user = req.body;
    db.users.insert(user).then(([result, fields]) => {
      if (result.affectedRows === 0) {    // If no rows are affected, send a 404.
        res.statusCode = 404;
        res.end();
        return;
      }
       res.statusCode = 200;
       res.json({ "id": result.insertId })
    });
  })

router.route("/:id")
  .get(function (req, res) {
    db.users.get(req.params.id).then((user) => {
      if (!user) {
        res.statusCode = 404;
        res.end()
        return;
      }
      res.statusCode = 200;
      res.json(user);
    });
  })
  .put(function (req, res) {
    let user = req.body;
    db.users.update(user).then(([result, fields]) => {
      if (result.affectedRows == 0) {    // If no rows are affected, send a 404.
        res.statusCode = 404;
        res.end();
        return;
      }
       res.statusCode = 200;
       res.json({ "id": result.insertId })
     });
  })
  .delete(function (req, res) {
    db.users.delete(req.params.id).then((user) => {
      res.statusCode = 200;
      res.end()
    });
  });

module.exports = router;
