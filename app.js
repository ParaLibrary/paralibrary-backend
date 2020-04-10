var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

var bookRoutes = require("./routes/book");
var bookCategoryRoutes = require("./routes/bookCategory");
var categoryRoutes = require("./routes/category");
var friendRoutes = require("./routes/friend");
var libraryRoutes = require("./routes/library");
var loanRoutes = require("./routes/loan");
var userRoutes = require("./routes/user");

var router = express.Router();
router
  .use("/", function (req, res, next) {
    console.log("Something is happening.");
    next();
  })
  .use("/book", bookRoutes)
  .use("/bookCategory", bookCategoryRoutes)
  .use("/category", categoryRoutes)
  .use("/friend", friendRoutes)
  .use("/library", libraryRoutes)
  .use("/loan", loanRoutes)
  .use("/user", userRoutes);

// Routes start with /api
app.use("/api", router);

// START THE SERVER
app.listen(port);
console.log("Magic happens on port " + port);
