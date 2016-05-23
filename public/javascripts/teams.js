$(function () {

    Promise.resolve($.get('/api/v1/team')).then(function(all_teams) {
        $('#teams').DataTable( {
            data: all_teams,
            'rowId': 'id',
            "columns": [
                { "data": "name" }
            ]
        });
    });
});