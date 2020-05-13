var express = require("express");
var router = express.Router();
var db = require("../db.js");

const fakeLoan = {
  id: "123",
  owner: {
    id: "123",
    name: "Owner Name",
    status: null,
  },
  owner_contact: "name@domain.com",
  requester: {
    id: "124",
    name: "Requester Name",
    status: "friends",
  },
  requester_contact: "name@domain.com",
  book: {
    id: "123",
    user_id: "123",
    title: "A Book Title",
    author: "An Author Name",
    isbn: "1234567890123",
    summary: "Can be very long",
    visibility: "public",
  },
  request_date: "2020-04-16T15:38:49.000Z",
  accept_date: "2020-04-16T15:38:49.000Z",
  loan_start_date: "2020-04-16T15:38:49.000Z",
  loan_end_date: "2020-04-16T15:38:49.000Z",
  status: "pending",
};

router
  .route("/")
  .get(function (req, res) {
    res.statusCode = 200;
    res.json([fakeLoan, fakeLoan, fakeLoan, fakeLoan, fakeLoan]);
  })
  .post(function (req, res) {
    res.status(200).end();
  });

router.route("/owner").get(function (req, res) {
  res.status(200).json([fakeLoan, fakeLoan, fakeLoan]);
});

router.route("/requester").get(function (req, res) {
  res.status(200).json([fakeLoan, fakeLoan]);
});

router
  .route("/:id")
  .get(function (req, res) {
    res.status(200).json(fakeLoan);
  })
  .put(function (req, res) {
    res.status(200).end();
  })
  .delete(function (req, res) {
    res.status(200).end();
  });

module.exports = router;
