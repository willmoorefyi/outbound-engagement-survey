var express = require('express');
var router = express.Router();
var _ = require('lodash');

var resultDao = require('../db/resultDao');

/* GET home page. */
router.get('/', function(req, res, next) {
    resultDao.getAllResultsWithLabels(new Date(), new Date())
        .then(function(results) {
            console.log("Found results: " + JSON.stringify(results));
            var data = _.map(results, function(result) {
                return _.merge(result, { 'name' : _.map(result.email.split('@')[0].split('\.'), _.capitalize).join(' ') });
            });

            res.render('index', {
                title: 'Outbound Engagement',
                result: data
            });
        })
        .catch(function(error) {
            res.render('error', {
                message: 'Failed to retrieve current iteration results',
                error: error
            });
        })

});

module.exports = router;
