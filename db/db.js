var pgp = require('pg-promise')();
var cn = process.env.DATABASE_URL;

var db = pgp(cn);

module.exports = db;
