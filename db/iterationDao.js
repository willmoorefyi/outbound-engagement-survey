var db = require('./db')
var iterationDao = {};

iterationDao.getAll = function() {
    return db.any('SELECT * FROM iteration');
}

iterationDao.fetchByDate = function(dateStart, dateEnd) {
    return db.any("SELECT * FROM iteration where date_retro_start < $1 AND date_retro_end >= $2",
                [ dateStart, dateEnd ]);
}

iterationDao.createIteration = function(name, startDate, endDate) {
    if(!name || !startDate || !endDate) {
        return Promise.reject('Did not provide "name", "startDate", and "endDate"');
    } else {
        return db.none("INSERT INTO iteration (name, date_retro_start, date_retro_end) VALUES($1, $2, $3);", 
            [ name, new Date(startDate), new Date(endDate) ]);
    }
}

module.exports = iterationDao;