$(function () {

    Promise.resolve($.get('/api/v1/person')).then(function(all_people) {
        $('#people').DataTable( {
            data: all_people,
            'rowId': 'id',
            "columns": [
                { "data": "email" },
                { "data": "name" },
            ]
        });
    });
});