var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.route('/')
.get(function(req, res) {
  // Get all users
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

})
.post(function(req, res) {
    
})
.delete(function(req, res) {
    
});

module.exports = router;