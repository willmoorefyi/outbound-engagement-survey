var db = require('./db');

var teamDao = {};

teamDao.getAll = function() {
    return db.any('SELECT * FROM team');
}

teamDao.fetchById = function(id) {
    return db.one("SELECT * FROM team WHERE id = $1", [ id ]);
}

teamDao.createTeam = function(name) {
    if(!name) {
        return Promise.reject("Did not provide team 'name'");
    } else {
        return db.none("INSERT INTO team (name) VALUES ($1);", [ name ]);
    };
}

module.exports = teamDao;