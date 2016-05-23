$(function () {

    Promise.all([
        $.get('/api/v1/person'),
        $.get('/api/v1/team')
    ]).spread(function(all_people, all_teams) {
        var teams = _.keyBy(all_teams, 'id');
        var people = _.map(all_people, function(person) {
            return _.merge(person, { 'team': teams[person.team_id]['name'] });
        });
        $('#people').DataTable( {
            data: all_people,
            'rowId': 'id',
            "columns": [
                { "data": "email" },
                { "data": "name" },
                { "data": "team" }
            ]
        });
    });
});