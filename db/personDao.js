var pgp = require('pg-promise')();
var cn = process.env.DATABASE_URL;

var personDao = {};

personDao.getAll = function() {
    var db = pgp(cn);
    return db.any('SELECT * FROM person');
}

personDao.fetchByEmail = function(email) {
    var db = pgp(cn);
    return db.one("SELECT * FROM person WHERE email = $1", [ email ]);
}

personDao.createPerson = function(email, name) {
    var db = pgp(cn);
    if(!email || !name) {
        return Promise.reject("Did not provide 'email' and 'name'");
    } else {
        return db.none("INSERT INTO person (email, name) VALUES($1, $2);", [ email, name ]);
    };
}

module.exports = personDao;