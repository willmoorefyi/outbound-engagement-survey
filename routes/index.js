var express = require('express');
var router = express.Router();

var pg = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Outbound Engagement' });
});

module.exports = router;
