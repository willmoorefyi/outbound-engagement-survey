var pgp = require('pg-promise')();
var cn = process.env.DATABASE_URL;

var teamDao = {};

teamDao.getAll = function() {
    var db = pgp(cn);
    return db.any('SELECT * FROM team');
}

teamDao.fetchById = function(id) {
    var db = pgp(cn);
    return db.one("SELECT * FROM team WHERE id = $1", [ id ]);
}

teamDao.createTeam = function(name) {
    var db = pgp(cn);
    if(!name) {
        return Promise.reject("Did not provide team 'name'");
    } else {
        return db.none("INSERT INTO team (name) VALUES ($1);", [ name ]);
    };
}

module.exports = teamDao;