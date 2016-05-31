var db = require('./db');

var personDao = {};

personDao.getAll = function() {
    return db.any('SELECT * FROM person');
}

personDao.fetchByEmail = function(email) {
    return db.one("SELECT * FROM person WHERE email = $1", [ email ]);
}

personDao.createPerson = function(email, name, team_id) {
    if(!email || !name || !team_id) {
        return Promise.reject("Did not provide 'email' and 'name'");
    } else {
        return db.none("INSERT INTO person (email, name, team_id) VALUES($1, $2, $3);", [ email, name, team_id ]);
    };
}

module.exports = personDao;