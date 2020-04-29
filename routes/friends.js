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
.post( async function(req, res) {

  let friend = req.body;    // The front end will pass in the status as raw json data

  if (req.body.status === "requested"){   
                            // If status === req, update the status
  }
  else if (req.body.status === "accepted"){

    const connection = await db.getConnection();
    try {
      await connection.query("START TRANSACTION");
          
      await connection.query("UPDATE friendships SET status = ? WHERE user_id = ?",
                 ["friends", friend.id]); 

      await connection.query("UPDATE friendships SET status = ? WHERE friend_id = ?",
                 ["friends", friend.id]);   

      await connection.query('COMMIT');
     // await connection.release();
    } 
    catch(e) {
      connection.query('ROLLBACK');
      //await connection.release();
      res.statusCode = 404
      res.end()
    }

      res.statusCode = 200;              
      res.end()
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
  else {   // If this case is hit, that means the json status was not any of the specified values (requested, accepted, rejected).
    res.statusCode = 404;
    res.end();
  }
})

module.exports = router;
