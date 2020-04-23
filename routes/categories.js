var express = require("express");
var router = express.Router();
var db = require('../db.js');

router.route('/')
  .post(function(req, res) {
    let category = req.body;
    db.categories.insert(category).then(([result, fields]) => {
      if (result.affectedRows === 0) {    // If no rows are affected, send a 404.
        res.statusCode = 404;
        res.end();
        return
      }
       res.statusCode = 200;
       res.json({ "id": result.insertId })
    });
  })

router.route("/:id")
  .get(function (req, res) {
    db.categories.get(req.params.id).then((category) => {
      if(!category) {
        res.statusCode = 404;
        res.end()
        return;
      }
      res.statusCode = 200;
      res.json(category);
    })
  })
  .put(function (req, res) {
    let category = req.body;
    db.categories.update(category).then(([result, fields]) => {
      if (result.affectedRows === 0) {    // If no rows are affected, send a 404.
        res.statusCode = 404;
        res.end();
        return;
      }
       res.statusCode = 200;
       res.json({ "id": result.insertId })
     });
  })
  .delete(function (req, res) {    
    db.categories.delete(req.params.id).then((category) => {
      res.statusCode = 200; 
      res.end()
    });
  });

module.exports = router;
