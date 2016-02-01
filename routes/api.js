var express = require('express');
var router = express.Router();

var pg = require('pg');

/* GET */
router.get('/', function(req, res, next) {
    console.log('Reading Database URL: ' + process.env.DATABASE_URL);

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM results;', function(err, results) {
            done();
            if(err) {
                console.error(err);
                response.send('Error: ' + err);
            } else {
                res.render('index', { title: 'API' });
            }
        });
    });
});

module.exports = router;