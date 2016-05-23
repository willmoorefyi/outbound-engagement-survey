var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.get('/', function(req, res, next) {
    res.render('teams', {
        title: 'Outbound Teams',
    });
});

module.exports = router;