var express = require("express");
var router = express.Router();

router
  .route("/:friend_id")
  .get(function (req, res) {
    res.json({ foo: "GET friend" });
  })
  .put(function (req, res) {})
  .post(function (req, res) {})
  .delete(function (req, res) {});

module.exports = router;
