var express = require('express');
var _ = require('lodash');
var personDao = require('../db/personDao');
var iterationDao = require('../db/iterationDao');
var resultDao = require('../db/resultDao');

var router = express.Router();

/* GET */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'API' });
});

router.get('/person', function(req, res, next) {
    personDao.getAll().then(function(results) {
        console.log(results);
        res.status(200).send(results);
    }).catch(_.curry(handleError)(res, 'Unable to fetch people from DB'));
});

router.post('/person', function(req, res, next) {
    var email = req.body.email;
    var name = req.body.name;

    console.log('Adding user: "' + email + '" with name "' + name + '"');

    personDao.createPerson(email, name).then(function() {
        res.status(200).send({ 'Status' : 'OK' });
    }).catch(_.curry(handleError)(res, 'Unable to insert person into DB'));
});

router.get('/iteration', function(req, res, next) {
    iterationDao.getAll().then(function(results) {
        res.status(200).send(results);
    }).catch(_.curry(handleError)(res, 'Unable to fetch iterations from DB'));
});

router.post('/iteration', function(req, res, next) {
    var name = req.body.name;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    console.log('Adding iteration: "' + name + '" with start "' + startDate + '" and end "' + endDate + '"');

    iterationDao.createIteration(name, startDate, endDate).then(function() {
        res.status(200).send({ 'Status' : 'OK' });
    }).catch(_.curry(handleError)(res, 'Unable to insert iteration into DB'));
});

router.get('/results', function(req, res, next) {
    resultDao.getAll().then(function(results) {
        res.status(200).send(results);
    }).catch(_.curry(handleError)(res, 'Unable to fetch results from DB'));
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

    Promise.all([personDao.fetchByEmail(email), iterationDao.fetchByDate(date, date)])
        .then(function(values) {
            person = values[0];
            iteration = values[1];
            console.log('Received person: ' + JSON.stringify(person));
            console.log('Received iteration: ' + JSON.stringify(iteration));
            var user_id = person.id;
            var iteration_id = iteration[0].id;

            return resultDao.createResult(user_id, iteration_id, fit, proud, excited, meaningful, company).then(function() {
                res.status(200).send({ 'Status' : 'OK' });
            });
        })
        .catch(_.curry(handleError)(res, 'Unable to insert results into DB'));
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