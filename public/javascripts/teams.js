$(function () {
    buildTable();

    $('#add-team').on('click', function(e) {
        e.preventDefault();
        var teamName = _.trim($('#team-name').val());
        if(teamName === '') {
            // TODO error state
            return;
        }

        Promise.resolve(
            $.post('/api/v1/team', {
                 "name": teamName
            })
        ).then(function() {
            $('#add-modal').modal('hide');
            $('#teams').DataTable().destroy();
            buildTable();
        }).catch(function(e) {
            //TODO error handler
        });
    });

    $('#edit-team').on('click', function(e) {
        e.preventDefault();
        var teamName = _.trim($('#edit-team-name').val());
        Promise.resolve().then(function() {
            $('#edit-modal').modal('hide');
            $('#teams').DataTable().destroy();
            buildTable();
        }).catch(function(e) {
            //TODO error handler
        });
    });

    $('#remove-team').on('click', function(e) {
        e.preventDefault();
        Promise.resolve().then(function() {
            $('#remove-modal').modal('hide');
            $('#teams').DataTable().destroy();
            buildTable();
        }).catch(function(e) {
            //TODO error handler
        });
    });

    $('#teams').on('draw.dt', function() {
        $('.editBtn').off('click').on('click', function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).data('teamid');
            $('#edit-modal').modal('show');

        });
        $('.removeBtn').off('click').on('click', function(e) {
            e.preventDefault();
            var id = $(e.currentTarget).data('teamid');
            $('#remove-modal').modal('show');
            console.log('removing row: ' + id);
        });
    });
});

var buildTable = function() {
    Promise.resolve($.get('/api/v1/team')).then(function(all_teams) {
        $('#teams').DataTable( {
            data: all_teams,
            'rowId': 'id',
            "bAutoWidth": false,
            "columns": [
                { "data": "name" },
                {
                    "data": "id",
                    "orderable": false,
                    "render": function( data, type, full, meta) {
                        //TOCO Somehow improve / externalize?
                        return '<a href="#" class="btn btn-primary editBtn" data-teamid="' + data + '">' +
                            '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                            '</a>';
                    }
                },
                {
                    "data": "id",
                    "orderable": false,
                    "render": function( data, type, full, meta) {
                        //TOCO Somehow improve / externalize?
                        return '<a href="#" class="btn btn-primary removeBtn" data-teamid="' + data + '">' +
                            '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                            '</a>';
                    }
                }

            ]
        });

    });
}