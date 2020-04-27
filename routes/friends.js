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

  let friend = req.body;    // The front end will pass in the status as raw json data

  if (req.body.status === "requested"){                           // If status === req, update the status
    db.friends.insertRequestRow(friend).then(([result, fields]) => {  

      if (result.affectedRows === 1) {                            // If the status was updated successfully, insert the waiting row. 
        db.friends.insertWaitingRow(friend).then(([result, fields]) => { 

          if (result.affectedRows === 0) {   // If there is an issue inserting the waiting row, send a 404
            res.statusCode = 404;
            res.end();
            return
          }
           res.statusCode = 200;              // If not, then we're good 
           res.end()
        })  
      }             
      else if (result.affectedRows === 0) {   // If there is an issue updating the status to requested, send a 404    
        res.statusCode = 404;
        res.end();
        return 
      }
    })    }
  else if (req.body.status === "accepted"){
    db.friends.updateReqRowToAcc(friend).then(([result, fields]) => {  

      if (result.affectedRows === 1) {                            // If the status was updated successfully, insert the waiting row. 
        db.friends.updateWaitRowToAcc(friend).then(([result, fields]) => { 

          if (result.affectedRows === 0) {   // If there is an issue inserting the waiting row, send a 404
            res.statusCode = 404;
            res.end();
            return
          }
            res.statusCode = 200;              // If not, then we're good 
            res.end()
        })  
      }  
      else if (result.affectedRows === 0) {    // Same thing as above - if the status equals 'friends', update the status and see if any rows were changed
        res.statusCode = 404;
        res.end();
        return
      }  
    })
  }
  else if (req.body.status === "rejected"){
    db.friends.deleteReqRow(friend).then(([result, fields]) => {   // Delete the target user's row

      if (result.affectedRows === 1) {                            
        db.friends.deleteWaitRow(friend).then(([result, fields]) => {   // Delete the requestee's row

          if (result.affectedRows === 0) {   // If an error occurs, send a 404
            res.statusCode = 404;
            res.end();
            return
          }
            res.statusCode = 200;              // If not, then we're good 
            res.end()
        })  
      }  
      else if (result.affectedRows === 0) {    
        res.statusCode = 404;
        res.end();
        return
      }  
    })
  }
  else{   // If this case is hit, that means the json status was not any of the specified values (requested, accepted, rejected).
    res.statusCode = 404;
    res.end();
  }
})

module.exports = router;
