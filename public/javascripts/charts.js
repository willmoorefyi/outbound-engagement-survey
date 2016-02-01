$(function () {
    // TODO promises
    $.get('/api/v1/person', function(people) {
        $.get('/api/v1/iteration', function(iterations) {
            $.get('/api/v1/results', function(results) {

                $('#container').highcharts({
                    title: {
                        text: 'Average Engagement Over Time',
                        x: -20 //center
                    },
                    xAxis: {
                        categories: _.map(iterations, function(iteration) {
                            return iteration.name;
                        })
                    },
                    yAxis: {
                        title: {
                            text: 'Avg. Engagement'
                        },
                        min: 0,
                        max: 7,
                        tickAmount: 8,
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ' Engagenent'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: _.map(people, function(person) {
                        return { 'name' : person.email, 
                            'data': _.chain(results)
                                .filter(function(result) {
                                    return result.user_id == person.id;
                                })
                                .map(function(result) {
                                    return _.round(_.mean([ 
                                        result.fit,
                                        result.proud,
                                        result.excited,
                                        result.meaningful
                                    ]));
                                })
                                .value()
                        };
                    })
                });

                $('#spinner').hide();
                
            });
        });
    });
});