require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const port = process.env.PORT || 8080;
const sessionStore = new MySQLStore({}, db.pool);

// Age is 12 hours
const maxAge = 1000 * 60 * 60 * 12;
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: maxAge,
    },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

<<<<<<< Updated upstream
=======
// CORS Configuration
const corsConfig = {
  origin: ["http://paralibrary.digital", "http://localhost:3000"],
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  maxAge: maxAge,
};
app.use(cors(corsConfig));

// Authentication Protection
>>>>>>> Stashed changes
const routeProtection = (req, res, next) => {
  if (req.session.userId == null) {
    // Unauthorized
    return res.status(403).end();
  }
  next();
};

var libraryRoutes = require("./routes/libraries");
var categoryRoutes = require("./routes/categories");
var friendRoutes = require("./routes/friends");
var loanRoutes = require("./routes/loans");
var userRoutes = require("./routes/users");
var loginRoutes = require("./routes/login");

var router = express.Router();
router
  .use("/", function (req, res, next) {
    if (process.env.NODE_ENV === "development") {
      console.log("Something is happening.");
      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
    }
    res.header("Access-Control-Allow-Credentials", true);
    next();
  })
  .use("/libraries", routeProtection, libraryRoutes)
  .use("/categories", routeProtection, categoryRoutes)
  .use("/friends", routeProtection, friendRoutes)
  .use("/loans", routeProtection, loanRoutes)
  .use("/users", routeProtection, userRoutes)
  .use("/login", loginRoutes);

// Routes start with /api
app.use("/api", router);

// START THE SERVER
app.listen(port);
console.log("Magic happens on port " + port);
