var express = require("express");
var router = express.Router();
var db = require('../db.js');

router.route('/')
  .get(function(req, res) {
    res.statusCode = 200;
    res.json([
      {
        "id": 123,
        "display_name": "WeichtNoise",
        "name": "Tait",
        "status": "friends"
      },
      {
        "id": 166,
        "display_name": "Dr. Arias",
        "name": "Carlos Arias",
        "status": "requested"
      },
      {
        "id": 167,
        "display_name": "NateTheGr8",
        "name": "Nate",
        "status": "requested"
      },
      {
        "id": 168,
        "display_name": "BigBenis",
        "name": "Ben",
        "status": "requested"
      },
      {
        "id": 169,
        "display_name": "Trashimoto",
        "name": "Trent",
        "status": "requested"
      },
      {
        "id": 179,
        "display_name": "Malachi (Tait's Cat)",
        "name": "Malchi",
        "status": "accepted"
      }
    ])
  })

router.route("/:id")
  .put(function (req, res) {
    res.statusCode = 200;
    res.end();
  })
  .delete(function (req, res) {
    res.statusCode = 200;
    res.end();
  })

router.route("/:id/request")
  .post(function(req, res) {
    res.statusCode = 200;
    res.end();
  })

  router.route("/:id/accept")
  .post(function(req, res) {
    res.statusCode = 200;
    res.end();
  })
  
router.route("/:id/reject")
  .post(function(req, res) {
    res.statusCode = 200;
    res.end();
  })

module.exports = router;
