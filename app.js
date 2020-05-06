var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

var libraryRoutes = require("./routes/libraries");
var categoryRoutes = require("./routes/categories");
var friendRoutes = require("./routes/friends");
var loanRoutes = require("./routes/loans");
var userRoutes = require("./routes/users");
var loginRoutes = require("./routes/login");

var router = express.Router();
router
  .use("/", function (req, res, next) {
    console.log("Something is happening.");
    next();
  })
  .use("/libraries", libraryRoutes)
  .use("/categories", categoryRoutes)
  .use("/friends", friendRoutes)
  .use("/loans", loanRoutes)
  .use("/users", userRoutes)
  .use("/login", loginRoutes);

// Routes start with /api
app.use("/api", router);

// START THE SERVER
app.listen(port);
console.log("Magic happens on port " + port);
