var express = require('express');
var router = express.Router();

router.route('/:book_id')
.get(function(req, res) {
    res.json({ foo: "GET book" })
})
.put(function(req, res) {

})
.post(function(req, res) {
    
})
.delete(function(req, res) {
    
});

module.exports = router;