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
.get(function (req, res) {
  db.friends.get(req.params.id).then((friend) => {    // TODO: This will go in the "/" route once sessions are running
    if(!friend) {                                     //       For now, it can only be tested in the "/:id" route 
      res.statusCode = 404;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.json(friend);
  })
}) 
.post(function(req, res) {
  res.statusCode = 200;

  let friend = req.body;    // The front end will pass in the status as raw json data
  if(!friend || !friend.status || req.params.id != friend.id) {
    res.statusCode = 404;
    res.end();
    return;
  }

  switch(friend.status) {
    case "requested":
      db.friends.update(1, friend.id, "requested", "waiting")
      .catch(error => {
        res.body = error;
        res.statusCode = 404;
      });
      break;
    case "accepted":
      db.friends.update(1, friend.id, "friends", "friends")
      .catch(error => {
        res.body = error;
        res.statusCode = 404;
      });
      break;
    case "rejected":
      db.friends.delete(1, friend.id)
      .catch(error => {
        res.body = error;
        res.statusCode = 404;
      });
      break;
    default:
      res.statusCode = 404;
  }

  res.end();
})

module.exports = router;
