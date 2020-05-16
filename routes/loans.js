var express = require("express");
var router = express.Router();
var db = require("../db.js");
router
  .route("/")
  .get(function (req, res) {
    //let userId = req.session.userId;
    let userId = 1;
    let status = "ownerAndRequster";
    db.loans
      .getLoansByStatus(userId, status)
      .then((loan) => {
        if (!loan) {
          res.statusCode = 404;
          res.end();
          return;
        }
        res.statusCode = 200;
        res.json(loan);
      })
      .catch((error) => {
        res.status(404).end();
      });
  })

  .post(function (req, res) {
    let loan = req.body;
    db.loans
      .insert(loan)
      .then(([result, fields]) => {
        if (result.affectedRows === 0) {
          res.statusCode = 404;
          res.end();
          return;
        }
        res.statusCode = 200;
        res.json({ id: result.insertId });
      })
      .catch((error) => {
        res.status(404).end();
      });
  });

router.route("/owner").get(function (req, res) {
  //let userId = req.session.userId;
  let userId = 1;
  let status = "owner";
  db.loans
    .getLoansByStatus(userId, status)
    .then((loan) => {
      if (!loan) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json(loan);
    })
    .catch((error) => {
      res.status(404).end();
    });
});

router.route("/requester").get(function (req, res) {
<<<<<<< HEAD
  //use userId instead of req.session.userId;
  let userId = 8;
  let status = "requester";
  db.loans
    .getLoansByStatus(userId, status)
    .then((loan) => {
=======
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

router
  .route("/:id")
  .get(function (req, res) {
    db.loans.getLoanById(req.params.id).then((loan) => {
>>>>>>> 4d69f7545fb8a94e84a4ae9f12b76d6070f5e422
      if (!loan) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.json(loan);
    })
    .catch((error) => {
      res.status(404).end();
    });
});

router
  .route("/:id")
  .get(function (req, res) {
    db.loans
      .getLoanById(req.params.id)
      .then((loan) => {
        if (!loan) {
          res.statusCode = 404;
          res.end();
          return;
        }
        res.statusCode = 200;
        res.json(loan);
      })
      .catch((error) => {
        res.status(404).end();
      });
  })

  .put(function (req, res) {
    let loan = req.body;
    db.loans
      .updateLoanById(loan)
      .then(([result, fields]) => {
        if (result.affectedRows === 0) {
          res.statusCode = 404;
          res.end();
          return;
        }
        res.statusCode = 200;
      })
      .catch((error) => {
        res.status(404).end();
      });
  })

  .delete(function (req, res) {
    db.loans
      .deleteLoan(req.params.id)
      .then((loan) => {
        res.statusCode = 200;
        res.end();
      })
      .catch((error) => {
        res.status(404).end();
      });
  });

module.exports = router;
