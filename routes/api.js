var express = require('express');
var router = express.Router();

var pg = require('pg');

/* GET */
router.get('/', function(req, res, next) {
    console.log('Reading Database URL: ' + process.env.DATABASE_URL);

    runSql('SELECT * FROM results;', function(err, results) {
        res.render('index', { title: 'API' });
    });
});

router.get('/person', function(req, res, next) {
    runSql("SELECT * FROM person", function(err, results) {
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
        res.status(400).send( { error: 'Did not provide "email" and "name" '});
    }

    runSql("INSERT INTO person (email, name) VALUES('" + email + "', '" + name + "');", function(err, results) {
        res.status(200).send({ 'Status' : 'OK' });
    }, this);
});

// TODO add error callback
function runSql(sql, callback, scope) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (!client) {
            console.error('Could not connect to database');
            response.send({ error: 'could not connect to Database' });
        } else {
            console.log('Connected to DB');
            client.query(sql, function(err, results) {
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