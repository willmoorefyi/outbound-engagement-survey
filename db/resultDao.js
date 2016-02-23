var pgp = require('pg-promise')();
var cn = process.env.DATABASE_URL;

var resultDao = {};

resultDao.getAll = function() {
    var db = pgp(cn);
    return db.any('SELECT * FROM results');
}

resultDao.getAllResultsWithLabels = function(dateStart, dateEnd) {
    var db = pgp(cn);
    return db.any(
`SELECT rt.id, p.email, rt.fit, rt.proud, rt.excited, rt.meaningful, rt.company 
FROM results rt JOIN iteration it ON rt.iteration_id = it.id
JOIN person p ON rt.user_id = p.id
where it.date_retro_start < $1 AND it.date_retro_end >= $2;`,
        [ dateStart, dateEnd ]);
}

resultDao.createResult = function(user_id, iteration_id, fit, proud, excited, meaningful, company) {
    var db = pgp(cn);
    if(!user_id || !iteration_id || !fit || !proud || !excited || !meaningful || !company) {
        return Promise.reject('Did not provide required fields for "result" insertion.  Required:' + 
            '"user_id", "iteration_id", "fit", "proud", "excited", "meaningful", "company"');
    } else {
        return db.none("INSERT INTO results (user_id, iteration_id, fit, proud, excited, meaningful, company) " + 
            "VALUES($1, $2, $3, $4, $5, $6, $7);",
            [user_id, iteration_id, fit, proud, excited, meaningful, company]);
    }
}

module.exports = resultDao;