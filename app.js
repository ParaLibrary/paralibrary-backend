require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
var cors = require("cors");

const port = process.env.PORT || 8080;
const sessionStore = new MySQLStore({}, db.pool);

const app = express();

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 3,
    },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Configuration
const corsConfig = {
  origin: ["http://paralibrary.digital", "http://localhost:3000"],
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  maxAge: 1728000,
};
app.use(cors(corsConfig));

// Authentication Protection
const routeProtection = (req, res, next) => {
  if (req.session.userId == null) {
    // Unauthorized
    return res.status(403).end();
  }
  next();
};

// API Routing
var libraryRoutes = require("./routes/libraries");
var categoryRoutes = require("./routes/categories");
var friendRoutes = require("./routes/friends");
var loanRoutes = require("./routes/loans");
var userRoutes = require("./routes/users");
var bookRoutes = require("./routes/books");
var loginRoutes = require("./routes/login");

var router = express.Router();
router
  .use("/", function (req, res, next) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `${req.protocol}://${req.hostname} sent the request: ${req.method} ${req.originalUrl}`
      );
    }
    next();
  })
  .use("/libraries", routeProtection, libraryRoutes)
  .use("/categories", routeProtection, categoryRoutes)
  .use("/friends", routeProtection, friendRoutes)
  .use("/loans", routeProtection, loanRoutes)
  .use("/users", routeProtection, userRoutes)
  .use("/books", routeProtection, bookRoutes)
  .use("/login", loginRoutes);

// Routes start with /api
app.use("/api", router);

// START THE SERVER
app.listen(port);
console.log("Magic happens on port " + port);
