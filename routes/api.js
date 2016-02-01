var express = require('express');
var router = express.Router();

var pg = require('pg');

/* GET */
router.get('/', function(req, res, next) {
    console.log('Reading Database URL: ' + process.env.DATABASE_URL);

    runSql('SELECT * FROM results;', null, function(err, results) {
        res.render('index', { title: 'API' });
    });
});

router.get('/person', function(req, res, next) {
    runSql("SELECT * FROM person", null, function(err, results) {
        console.log('Got results: ' + results);
        res.status(200).send(results.rows);
    });
});

router.put('/person', function(req, res, next) {
    var email = req.body.email;
    var name = req.body.name;

    console.log('Connecting to DB: "' + process.env.DATABASE_URL + '" to add user: "' + 
        email + '" with name "' + name + '"');

    if(!email || !name) {
        res.status(400).send( { error: 'Did not provide "email" and "name"'});
    }

    runSql("INSERT INTO person (email, name) VALUES($1, $2);", [ email, name ], function(err, results) {
        res.status(200).send({ 'Status' : 'OK' });
    }, this);
});

router.get('/iteration', function(req, res, next) {
    runSql("SELECT * FROM iteration", null, function(err, results) {
        console.log('Got results: ' + results);
        res.status(200).send(results.rows);
    });
});

router.put('/iteration', function(req, res, next) {
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

// TODO add error callback
function runSql(sql, params, callback, scope) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (!client) {
            console.error('Could not connect to database');
            response.send({ error: 'could not connect to Database' });
        } else {
            console.log('Connected to DB');
            client.query(sql, params, function(err, results) {
                done();
                if (err) {
                    console.error('Error: ' + err);
                    response.status(500).send({ error: err });
                } else {
                    callback.call(scope, err, results);
                }
            });
        }
    });
}

function BadRequest(msg){
  this.name = 'Bad Request';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
} 

module.exports = router;