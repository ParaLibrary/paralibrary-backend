var express = require("express");
var router = express.Router();
var db = require("../db.js");
const { OAuth2Client } = require("google-auth-library");
const gClientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(gClientId);

// Age is 3 hours
const maxAge = 3 * 1000 * 60 * 60;

router.route("/login").post((req, res) => {
  let token = req.body.idtoken;
  verify(token)
    .then((payload) => {
      // Already signed in
      if (req.session.userId) {
        return { userId: req.session.userId, new: false, maxAge: maxAge };
      }
      // Sign in
      return db.users
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
          return user.id;
        })
        .then((userId) => {
          // Temporary (?) code to add user pictures to existing accounts
          db.users.getById(userId, userId).then((user) => {
            if (user.picture || !payload.picture) {
              return;
            }
            user.picture = payload.picture;
            db.users.update(user);
          });
          // Store only the userId in the session
          req.session.userId = userId;
          return { userId: userId, new: true, maxAge: maxAge };
        });
    })
    .then((json) => {
      res.status(200).json(json).end();
    })
    .catch((error) => {
      res.status(401).end();
    });
});

router.route("/logout").post((req, res) => {
  if (!req.session) {
    res.status(401).end();
    return;
  }
  req.session.destroy();
  res.status(200).end();
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

module.exports = { router, maxAge };
