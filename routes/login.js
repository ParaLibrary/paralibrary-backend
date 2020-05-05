var express = require("express");
var router = express.Router();
var db = require("../db.js");
const { OAuth2Client } = require("google-auth-library");
const clientId =
  "631703414652-navvamq2108qu88d9i7bo77gn2kqsi40.apps.googleusercontent.com";
const client = new OAuth2Client(clientId);

router.route("/").post(function (req, res) {
  verify(req.body.idtoken)
    .then((payload) => {
      console.log(payload);
    })
    .then(() => {
      // Create session
      // Return session id in cookie (httpOnly)
      res.statusCode = 200;
      res.end();
    })
    .catch((error) => {
      console.error(error);
    });
});

async function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      audience: clientId,
    })
    .then((ticket) => {
      return ticket.getPayload();
    });
}

module.exports = router;
