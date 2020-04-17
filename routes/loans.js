var express = require("express");
var router = express.Router();
var db = require('../db.js');

router.route('/')
  .get(function(req, res) {
    res.statusCode = 200;
    res.json([
      {
        "id": 234,
        "owner_id": 1,
        "requester_id": 5,
        "book_id": 3,
        "request_date": "2020-04-08T15:38:49.000Z",
        "accept_date": "2020-04-09T15:38:49.000Z",
        "loan_start_date": "2020-05-01T15:38:49.000Z",
        "loan_end_date": "2020-05-10T15:38:49.000Z",
        "status": "accepted"
      },
      {
        "id": 236,
        "owner_id": 5,
        "requester_id": 1,
        "book_id": 2,
        "request_date": "2020-04-16T15:38:49.000Z",
        "accept_date": null,
        "loan_start_date": "2020-06-01T15:38:49.000Z",
        "loan_end_date": "2020-06-03T15:38:49.000Z",
        "status": "pending"
      }
    ])
  })
  .post(function(req, res) {
    res.statusCode = 200;
    res.json({
      "id": 237,
      "owner_id": 6,
      "requester_id": 1,
      "book_id": 1,
      "request_date": "2020-04-16T15:38:49.000Z",
      "accept_date": null,
      "loan_start_date": "2020-06-01T15:38:49.000Z",
      "loan_end_date": "2020-06-03T15:38:49.000Z",
      "status": "pending"
    })
  })

router.route("/owner")
  .get(function(req, res) {
    res.statusCode = 200;
    res.json([
      {
        "id": 234,
        "owner_id": 1,
        "requester_id": 5,
        "book_id": 3,
        "request_date": "2020-04-08T15:38:49.000Z",
        "accept_date": "2020-04-09T15:38:49.000Z",
        "loan_start_date": "2020-05-01T15:38:49.000Z",
        "loan_end_date": "2020-05-10T15:38:49.000Z",
        "status": "accepted"
      }
    ])
  })

router.route("/requester")
  .get(function(req, res) {
    res.statusCode = 200;
    res.json([
      {
        "id": 236,
        "owner_id": 5,
        "requester_id": 1,
        "book_id": 2,
        "request_date": "2020-04-16T15:38:49.000Z",
        "accept_date": null,
        "loan_start_date": "2020-06-01T15:38:49.000Z",
        "loan_end_date": "2020-06-03T15:38:49.000Z",
        "status": "pending"
      }
    ])
  })

router.route("/:loan_id")
  .get(function (req, res) {
    res.statusCode = 200;
    res.json({
        "id": 234,
        "owner_id": 1,
        "requester_id": 5,
        "book_id": 3,
        "request_date": "2020-04-08T15:38:49.000Z",
        "accept_date": "2020-04-09T15:38:49.000Z",
        "loan_start_date": "2020-05-01T15:38:49.000Z",
        "loan_end_date": "2020-05-10T15:38:49.000Z",
        "status": "accepted"
      })
  })
  .put(function (req, res) {
    res.statusCode = 200;
    res.end();
  })
  .delete(function (req, res) {
    res.statusCode = 200;
    res.end();
  });

module.exports = router;
