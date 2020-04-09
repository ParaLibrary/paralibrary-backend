var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var bookRoutes = require('./routes/book');
var userRoutes = require('./routes/user');
var router = express.Router();
router
    .use('/', function(req, res, next) {
        console.log('Something is happening.');
        next();
    })
    .use('/book', bookRoutes)
    .use('/user', userRoutes)

// Routes start with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);