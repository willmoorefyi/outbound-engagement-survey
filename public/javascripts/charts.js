$(function () {
    // TODO promises
    $.get('/api/v1/person', function(people) {
        $.get('/api/v1/iteration', function(iterations) {
            $.get('/api/v1/results', function(results) {

                $('#container').highcharts({
                    chart: {
                        type: 'spline'
                    },
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
                        // TODO this is horrible, clean it up!
                        var my_results = _.filter(results, function(result) {
                            return result.user_id == person.id;
                        });

                        var data = _.map(iterations, function(iteration) {

                            var my_result = _.find(my_results, function(my_result) {
                                return my_result.iteration_id == iteration.id;
                            });

                            if (my_result) { 
                                return _.round(_.mean([ 
                                    my_result.fit,
                                    my_result.proud,
                                    my_result.excited,
                                    my_result.meaningful
                                ]));
                            } else {
                                return null;
                            }
                        });

                        return { 'name' : person.email, 'data' : data };
                    })
                });

                $('#spinner').hide();
                
            });
        });
    });
});