var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/")
  .get(function (req, res) {
    let user = req.body;
    db.users.getUserByName(user).then(user => {
      if (!user) {
        res.statusCode = 404;
        res.end()
        return;
      }
      res.statusCode = 200;
      res.json(user);
    });
  })
  .post(function (req, res) {
    let user = req.body;
    db.users.insert(user).then(([result, fields]) => {
      if (result.affectedRows === 0) {    
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
    db.users.getUserById(req.params.id).then((user) => {
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
      if (result.affectedRows == 0) {    
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
