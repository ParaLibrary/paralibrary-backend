var express = require("express");
var router = express.Router();
var db = require("../db.js");

router
  .route("/")
  .get(function (req, res) {
    let user = req.session.userId;
    db.loans.getLoansByUserId(user).then((loan) => {
      if (!loan) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json(loan);
    });
  })

  .post(function (req, res) {
    let loan = req.body;
    db.loans.insert(loan).then(([result, fields]) => {
      if (result.affectedRows === 0) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json({ id: result.insertId });
    });
  });

router.route("/owner").get(function (req, res) {
  let user = req.session.userId;
  db.loans.getLoansByOwner(user).then((loan) => {
    if (!loan) {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.json(loan);
  });
});

router.route("/requester").get(function (req, res) {
  let user = req.session.userId;
  db.loans.getLoansByRequester(user).then((loan) => {
    if (!loan) {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.json(loan);
  });
});

router
  .route("/:id")
  .get(function (req, res) {
    db.loans.getLoanById(req.params.id).then((loan) => {
      if (!loan) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json(loan);
    });
  })

  .put(function (req, res) {
    let loan = req.body;
    db.loans.updateLoanById(loan).then(([result, fields]) => {
      if (result.affectedRows === 0) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
    });
  })

  .delete(function (req, res) {
    db.loans.deleteLoan(req.params.id).then((loan) => {
      res.statusCode = 200;
      res.end();
    });
  });

module.exports = router;
