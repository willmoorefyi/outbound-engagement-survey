var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.get('/', function(req, res, next) {
    res.render('people', {
        title: 'Outbound People',
    });
});

module.exports = router;