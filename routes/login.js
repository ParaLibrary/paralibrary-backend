var express = require("express");
var router = express.Router();
var db = require("../db.js");
const { OAuth2Client } = require("google-auth-library");
const gClientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(gClientId);

router.route("/").post((req, res) => {
  let token = req.body.idtoken;
  verify(token)
    .then((payload) => {
      if (!req.session.userId) {
        // Check if user is in database already
        db.users
          .getByGoogleId(payload.sub)
          .then((user) => {
            // Create new user
            if (!user) {
              return db.users
                .insert({ name: payload.name, google_id: payload.sub })
                .then(([results, fields]) => {
                  return results.insertId;
                });
            }
            // Existing user
            return user.id;
          })
          .then((userId) => {
            // Store only the userId in the session
            req.session.userId = userId;
            res.json({ userId: userId });
            res.end();
          });
      } else {
        res.json({ userId: req.session.userId });
        res.end();
      }
    })
    .catch((error) => {
      res.status(401).end();
    });
});

async function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      audience: gClientId,
    })
    .then((ticket) => {
      return ticket.getPayload();
    });
}

module.exports = router;
