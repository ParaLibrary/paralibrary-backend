var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

var bookRoutes = require("./routes/books");
var bookCategoryRoutes = require("./routes/booksCategories");
var categoryRoutes = require("./routes/categories");
var friendRoutes = require("./routes/friends");
var libraryRoutes = require("./routes/libraries");
var loanRoutes = require("./routes/loans");
var userRoutes = require("./routes/users");

var router = express.Router();
router
  .use("/", function (req, res, next) {
    console.log("Something is happening.");
    next();
  })
  .use("/books", bookRoutes)
  .use("/categories", categoryRoutes)
  .use("/friends", friendRoutes)
  .use("/loans", loanRoutes)
  .use("/users", userRoutes);

// Routes start with /api
app.use("/api", router);

// START THE SERVER
app.listen(port);
console.log("Magic happens on port " + port);
