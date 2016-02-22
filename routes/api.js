var express = require('express');
var _ = require('lodash');
var runSql = require('../db/runSql');
var userDao = require('../db/userDao');

var router = express.Router();

/* GET */
router.get('/', function(req, res, next) {
    console.log('Reading Database URL: ' + process.env.DATABASE_URL);

    runSql('SELECT * FROM results;', null, function(err, results) {
        res.render('index', { title: 'API' });
    });
});

router.get('/person', function(req, res, next) {
    userDao.getAllPeople().then(function(results) {
        res.status(200).send(results);
    }).catch(_.curry(handleError)(res, 'Unable to fetch people from DB'));
});

router.post('/person', function(req, res, next) {
    var email = req.body.email;
    var name = req.body.name;

    console.log('Adding user: "' + email + '" with name "' + name + '"');

    userDao.createPerson(email, name).then(function() {
        res.status(200).send({ 'Status' : 'OK' });
    }).catch(_.curry(handleError)(res, 'Unable to insert person into DB'));
});

router.get('/iteration', function(req, res, next) {
    runSql("SELECT * FROM iteration", null, function(err, results) {
        console.log('Got results: ' + results);
        res.status(200).send(results.rows);
    });
});

router.post('/iteration', function(req, res, next) {
    var name = req.body.name;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    console.log('Connecting to DB: "' + process.env.DATABASE_URL + '" to add iteration: "' + 
        name + '" with start "' + startDate + '" and end "' + endDate + '"');

    if(!name || !startDate || !endDate) {
        res.status(400).send( { error: 'Did not provide "name", "startDate", and "endDate"'});
    }

    runSql("INSERT INTO iteration (name, date_retro_start, date_retro_end) VALUES($1, $2, $3);", 
        [ name, new Date(startDate), new Date(endDate) ], function(err, results) {
        res.status(200).send({ 'Status' : 'OK' });
    });
});

router.get('/results', function(req, res, next) {
    runSql("SELECT * FROM results", null, function(err, results) {
        res.status(200).send(results.rows);
    });
});

router.post('/results', function(req, res, next) {
    var email = req.body.email;
    var date = req.body.date;
    var fit = req.body.fit;
    var proud = req.body.proud;
    var excited = req.body.excited;
    var meaningful = req.body.meaningful;
    var company = req.body.company;

    console.log('Received request: ' + JSON.stringify(req.body));

    if(!email || !date || !fit || !proud || !excited || !meaningful || !company ) {
        res.status(400).send( { error: 'Did not provide all required values!'});
    }

    runSql("SELECT id FROM person WHERE email = $1", [ email ], function(err, results) {
        console.log("Found results: " + results.rows.length);
        if (err || results.rows.length != 1) {
            res.status(500).send({ error: 'No matching user ID found for email "' + email + '"'});
        } else {
            var user_id = results.rows[0].id;
            runSql("SELECT id FROM iteration where date_retro_start < $1 AND date_retro_end >= $2", 
                [ date, date ], function(err,results) {
                if (err || results.rows.length != 1) {
                    res.status(500).send({ error: 'No single matching iteration ID found for date "' + date + '"'});
                } else {
                    var iteration_id = results.rows[0].id;
                    runSql("INSERT INTO results (user_id, iteration_id, fit, proud, excited, meaningful, company) " + 
                        "VALUES($1, $2, $3, $4, $5, $6, $7);",  
                        [user_id, iteration_id, fit, proud, excited, meaningful, company], 
                        function(err, results) {
                        if(err) {
                            res.status(500).send({ error: 'Could not insert into results table: ' + err });
                        } else {
                            res.status(200).send({ 'Status' : 'OK' });
                        }
                    });
                }
            });
        }
    });
});

function BadRequest(msg){
  this.name = 'Bad Request';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

function handleError(response, description, error) {
    response.status(500).send({ 'error' : description, 'errorDetails' : error});
}

module.exports = router;