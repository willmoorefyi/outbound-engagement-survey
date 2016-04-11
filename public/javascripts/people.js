$(function () {

    Promise.resolve($.get('/api/v1/person')).then(function(all_people) {
        $('#people').DataTable( {
            //data: _.map(all_people, function(person) { return _.values(person) }),
            data: all_people,
            'rowId': 'id',
            "columns": [
                { "data": "email" },
                { "data": "name" },
            ]
        });
    });
});