var pg = require('pg');

module.exports = function(sql, params, callback, scope) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (!client) {
            console.error('Could not connect to database');
            callback.call(scope, { error: 'Could not connect to database'});
        } else if (err) {
            calbback.call(scope, err);
        } else {
            client.query(sql, params, function(err, results) {
                done();
                if (err) {
                    console.error('Error executing query: "' + sql + '", ' + params + '"', err);
                }
                callback.call(scope, err, results);
            });
        }
    });
};