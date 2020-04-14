var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.route('/')
  .get(function(req, res) {
    // Get all users
  })
  .post(function(req, res){

  })

router.route('/:id')
  .get(function (req, res) {
    db.users.get(req.params.id)
    .then(function(user) {
      if(!user) {
        res.statusCode = 404;
        return;
      }
      res.statusCode = 200;
      res.json(user);
    })
  })
  .put(function(req, res) {
    let user = req.body;
    db.users.insertOrUpdate(user)
    .then((result) => {
      if(result.something) { // TODO
        res.statusCode = 404;
        return;
      }
      res.statusCode = 200;
    })
  })
  .delete(function(req, res) {
      
  });

module.exports = router;