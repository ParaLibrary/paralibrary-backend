var express = require("express");
var router = express.Router();
var db = require("../db.js");

router.route("/")
.get(function (req, res) {    
  let userId = req.body;
  db.libraries.getUsersLibrary(userId).then((user) => {
    if (!user) {
      res.statusCode = 404;
      res.end()
      return;
   }
    res.statusCode = 200;
    res.json(user);
  });
})
/*.get(function (req, res) {
  res.json({
    user: {
      id: 123,
      display_name: "Up to 255 chars",
      name: "Up to 255 chars",
      status: "friends",
    },
    books: [
      {
        id: 123,
        user_id: 123,
        title: "A Book Title",
        author: "An Author Name",
        isbn: "1234567890123",
        summary: "Can be very long",
        visibility: "public",
        categories: ["horror", "scifi"],
        loan: {
          id: 123,
          owner: {
            id: 123,
            display_name: "Up to 255 chars",
            name: "Up to 255 chars",
          },
          requester: {
            id: 123,
            display_name: "Up to 255 chars",
            name: "Up to 255 chars",
          },
          request_date: "2020-04-16T15:38:49.000Z",
          accept_date: "2020-04-16T15:38:49.000Z",
          loan_start_date: "2020-04-16T15:38:49.000Z",
          loan_end_date: "2020-04-16T15:38:49.000Z",
          status: "pending",
        },
      },
      {
        id: 124,
        user_id: 123,
        title: "A Book Title 2",
        author: "An Author Name 2",
        isbn: "9876543210",
        summary: "Is a summary",
        visibility: "private",
        categories: ["horror", "scifi"],
        loan: null,
      },
    ],
  });
});*/

router.route("/:id")
.get(function (req, res) {    
  db.libraries.getLibraryById(req.params.id).then((user) => {
    if (!user) {
      res.statusCode = 404;
      res.end()
      return;
   }
    res.statusCode = 200;
    res.json(user);
  });
})
/*
.get(function (req, res) {
  res.json({
    user: {
      id: 123,
      display_name: "Up to 255 chars",
      name: "Up to 255 chars",
      status: "friends",
    },
    books: [
      {
        id: 123,
        user_id: 123,
        title: "A Book Title",
        author: "An Author Name",
        isbn: "1234567890123",
        summary: "Can be very long",
        visibility: "public",
        categories: ["horror", "scifi"],
        loan: {
          id: 123,
          owner: {
            id: 123,
            display_name: "Up to 255 chars",
            name: "Up to 255 chars",
          },
          requester: {
            id: 123,
            display_name: "Up to 255 chars",
            name: "Up to 255 chars",
          },
          request_date: "2020-04-16T15:38:49.000Z",
          accept_date: "2020-04-16T15:38:49.000Z",
          loan_start_date: "2020-04-16T15:38:49.000Z",
          loan_end_date: "2020-04-16T15:38:49.000Z",
          status: "pending",
        },
      },
      {
        id: 124,
        user_id: 123,
        title: "A Book Title 2",
        author: "An Author Name 2",
        isbn: "9876543210",
        summary: "Is a summary",
        visibility: "private",
        categories: ["horror", "scifi"],
        loan: null,
      },
    ],
  });
});*/

module.exports = router;
