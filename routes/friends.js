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
/*
`   GET`|`/friends`               | Get all the friends for the current user         |    Currently static
`DELETE`|`/friends/:id`           | Delete a friendships object by its id            |    Done
`  POST`|`/friends/:id/request`   | Request friendship with the target user          |    wip
`  POST`|`/friends/:id/accept`    | Accept friendship request with the target user   |    wip
`  POST`|`/friends/:id/reject`    | Reject friendship request with the target user   |    wip
*/


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
  .delete(function (req, res) {
    db.friends.delete(req.params.id).then((friend) => {   // TODO: This will work, but only delete one of the two rows of the corresponding friendship
      res.statusCode = 200;                               //       Once sessions are running, we can be able to delete the other row.
      res.end();
    })
  })

router.route("/:id/request")    // Request a friendship with a target user
  .post(function(req, res) {
    /*db.friends.updateStatusToReq(req.params.id).then((friend) => {  
      return db.friends.updateStatusToWaiting(req.params.id) 
    }).then((friend) => {
    res.statusCode = 200; 
    res.end()                   
    });*/

    let friend = req.body;

    if (req.body.status === "requested"){                           // If status === req, update the status
      db.friends.updateStatus(friend).then(([result, fields]) => {  

        if (result.affectedRows === 1) {                            // If the status was updated successfully, insert the waiting row. 
          db.friends.insertWaitingRow(friend).then(([result, fields]) => { 

            if (result.affectedRows === 0) {   // If there is an issue inserting the waiting row, send a 404
             res.statusCode = 404;
             res.end();
             return
            }
             res.statusCode = 200;              // If not, then we're good.
             res.json({ "id": result.insertId })// return here w/ res.end(). I don't think we'd need to return result.insertId here.
          })
        }             
        else if (result.affectedRows === 0) {   // If there is an issue updating the status to requested, send a 404    
          res.statusCode = 404;
          res.end();
          return
        }
      })
    }
    else if (req.body.status === "friends"){
      db.friends.updateStatus(friend).then(([result, fields]) => {  

      if (result.affectedRows === 0) {    // If no rows are affected, send a 404.
        res.statusCode = 404;
        res.end();
        return
      }
        res.statusCode = 200;
        res.json({ "id": result.insertId })
      })
    }
    else if (req.body.status === "rejected"){
      db.friends.delete(friend).then(([result, fields]) => {  
     
        if (result.affectedRows === 0) {    // If no rows are affected, send a 404.
          res.statusCode = 404;
          res.end();
          return
        }
          res.statusCode = 200;
          res.json({ "id": result.insertId })
       })
      }
    else{
      res.end();
    }
    res.end();
    //db.friends.insert(friend).then(([result, fields]) => { 
    //db.friends.updateStatusToRej(req.params.id).then((friend) => {
    //res.statusCode = 200;
    //res.end();
    //})
  })

  router.route("/:id/accept")
  .post(function(req, res) {
    db.friends.updateStatusToAcc(req.params.id).then((friend) => {   
    res.statusCode = 200; 
    res.end()                   // Now that a target user's status is friends, how do we delete the row that says waiting?
    });
  })
  
router.route("/:id/reject")
.post(function(req, res) {
  db.friends.updateStatusToRej(req.params.id).then((friend) => {   
  res.statusCode = 200; 
  res.end()                     // Would we just call delete here, sicne we don't want to change the field to rejected? 
  });
})

module.exports = router;
