var pgp = require('pg-promise')();
var cn = process.env.DATABASE_URL;

var userDao = {};


userDao.getAllPeople = function() {
    var db = pgp(cn);
    return db.any('SELECT * FROM persons');
}

userDao.createPerson = function(email, name) {
    var db = pgp(cn);
    if(!email || !name) {
        return Promise.reject("Did not provide 'email' and 'name'");
    } else {
        return db.none("INSERT INTO person (email, name) VALUES($1, $2);", [ email, name ]);
    };
}

module.exports = userDao;