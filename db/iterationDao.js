var pgp = require('pg-promise')();
var cn = process.env.DATABASE_URL;

var iterationDao = {};

iterationDao.getAll = function() {
    var db = pgp(cn);
    return db.any('SELECT * FROM iteration');
}

iterationDao.createIteration = function(name, startDate, endDate) {
    var db = pgp(cn);
    if(!name || !startDate || !endDate) {
        return Promise.reject('Did not provide "name", "startDate", and "endDate"');
    } else {
        return db.none("INSERT INTO iteration (name, date_retro_start, date_retro_end) VALUES($1, $2, $3);", 
            [ name, new Date(startDate), new Date(endDate) ]);
    }
}

module.exports = iterationDao;