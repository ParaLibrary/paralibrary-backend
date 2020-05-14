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

const loanedToMe = [
  {
    id: "5",
    book_id: "91",
    status: "pending",
    book: {
      id: "1",
      user_id: "1",
      title: "Consider Phlebas",
      author: "Iain M. Banks",
      isbn: "",
      summary: "",
      visibility: "public",
    },
    owner: {
      id: "1",
      name: "Bob",
    },
    requester: {
      id: "2",
      name: "Sally",
    },
    owner_contact: "bob@bob.bob",
    requester_contact: "sally@sally.sally",
    accept_date: "",
    request_date: "",
    loan_start_date: "",
    loan_end_date: "",
  },
  {
    id: "6",
    book_id: "73",
    status: "accepted",
    book: {
      id: "73",
      user_id: "1",
      title: "Of Mice and Men",
      author: "",
      isbn: "",
      summary: "",
      visibility: "public",
    },
    owner: {
      id: "1",
      name: "Bob",
    },
    requester: {
      id: "2",
      name: "Sally",
    },
    owner_contact: "bob@bob.bob",
    requester_contact: "sally@sally.sally",
    accept_date: "",
    request_date: "",
    loan_start_date: "",
    loan_end_date: "",
  },
  {
    id: "7",
    book_id: "37",
    book: {
      id: "1",
      user_id: "1",
      title: "The Fifth Season",
      author: "",
      isbn: "",
      summary: "",
      visibility: "public",
    },
    status: "loaned",
    owner: {
      id: "1",
      name: "Bob",
    },
    requester: {
      id: "2",
      name: "Sally",
    },
    owner_contact: "bob@bob.bob",
    requester_contact: "sally@sally.sally",
    accept_date: "",
    request_date: "",
    loan_start_date: "",
    loan_end_date: "",
  },
  {
    id: "8",
    book_id: "4",
    status: "returned",
    book: {
      id: "1",
      user_id: "1",
      title: "The Name of This Book is Secret",
      author: "",
      isbn: "",
      summary: "",
      visibility: "public",
    },
    owner: {
      id: "1",
      name: "Bob",
    },
    requester: {
      id: "2",
      name: "Sally",
    },
    owner_contact: "bob@bob.bob",
    requester_contact: "sally@sally.sally",
    accept_date: "",
    request_date: "",
    loan_start_date: "",
    loan_end_date: "",
  },
];

const loanedByMe = [
  {
    id: "1",
    book_id: "2",
    status: "pending",
    book: {
      id: "1",
      user_id: "1",
      title: "Dummy's Guide to Telekinesis",
      author: "",
      isbn: "",
      summary: "",
      visibility: "public",
    },
    owner: {
      id: "1",
      name: "Bob",
    },
    requester: {
      id: "2",
      name: "Sally",
    },
    owner_contact: "bob@bob.bob",
    requester_contact: "sally@sally.sally",
    accept_date: "",
    request_date: "",
    loan_start_date: "",
    loan_end_date: "",
  },
  {
    id: "2",
    book_id: "1",
    status: "accepted",
    book: {
      id: "1",
      user_id: "1",
      title: "Third Class Superhero",
      author: "",
      isbn: "",
      summary: "",
      visibility: "public",
    },
    owner: {
      id: "1",
      name: "Bob",
    },
    requester: {
      id: "2",
      name: "Sally",
    },
    owner_contact: "bob@bob.bob",
    requester_contact: "sally@sally.sally",
    accept_date: "",
    request_date: "",
    loan_start_date: "",
    loan_end_date: "",
  },
  {
    id: "3",
    book_id: "3",
    status: "loaned",
    book: {
      id: "1",
      user_id: "1",
      title: "Genius at Play",
      author: "",
      isbn: "",
      summary: "",
      visibility: "public",
    },
    owner: {
      id: "1",
      name: "Bob",
    },
    requester: {
      id: "2",
      name: "Sally",
    },
    owner_contact: "bob@bob.bob",
    requester_contact: "sally@sally.sally",
    accept_date: "",
    request_date: "",
    loan_start_date: "",
    loan_end_date: "",
  },
  {
    id: "4",
    book_id: "4",
    status: "returned",
    book: {
      id: "1",
      user_id: "1",
      title: "Cryptonomicon",
      author: "",
      isbn: "",
      summary: "",
      visibility: "public",
    },
    owner: {
      id: "1",
      name: "Bob",
    },
    requester: {
      id: "2",
      name: "Sally",
    },
    owner_contact: "bob@bob.bob",
    requester_contact: "sally@sally.sally",
    accept_date: "",
    request_date: "",
    loan_start_date: "",
    loan_end_date: "",
  },
];

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
  res.status(200).json(loanedByMe);
});

router.route("/requester").get(function (req, res) {
  res.status(200).json(loanedToMe);
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
