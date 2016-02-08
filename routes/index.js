var express = require('express');
var router = express.Router();
var _ = require('lodash');

var runSql = require('../db/runSql');

/* GET home page. */
router.get('/', function(req, res, next) {
    runSql(`SELECT rt.id, p.email, rt.fit, rt.proud, rt.excited, rt.meaningful, rt.company 
FROM results rt JOIN iteration it ON rt.iteration_id = it.id
JOIN person p ON rt.user_id = p.id
where it.date_retro_start < $1 AND it.date_retro_end >= $2;`,
    [ new Date(), new Date() ],
    function(err, results) {
        console.log("Found results: " + results.rows.length);
        var data = _.map(results.rows, function(result) {
            return _.merge(result, { 'name' : _.map(result.email.split('@')[0].split('\.'), _.capitalize).join(' ') });
        });

        res.render('index', { 
            title: 'Outbound Engagement',
            result: data 
        });
    });

});

module.exports = router;
