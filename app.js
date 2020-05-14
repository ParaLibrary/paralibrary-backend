require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors");

const libraryRoutes = require("./routes/libraries");
const categoryRoutes = require("./routes/categories");
const friendRoutes = require("./routes/friends");
const loanRoutes = require("./routes/loans");
const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/books");
const { router: authRoutes, maxAge } = require("./routes/auth");

const port = process.env.PORT || 8080;
const app = express();

// Session Configuration
const sessionStore = new MySQLStore({}, db.pool);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      maxAge: maxAge,
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
  maxAge: maxAge,
};
app.use(cors(corsConfig));

// Authentication Protection
const routeProtection = (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    req.session.userId = 1;
    next();
    return;
  }
  if (req.session.userId == null) {
    // Unauthorized
    return res.status(403).end();
  }
  next();
};

// API Routing
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
  .use("/auth", authRoutes);

// Routes start with /api
app.use("/api", router);

// START THE SERVER
app.listen(port);
console.log("Magic happens on port " + port);
