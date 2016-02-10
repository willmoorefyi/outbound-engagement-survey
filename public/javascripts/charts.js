$(function () {

    Promise.all([
        $.get('/api/v1/person'),
        $.get('/api/v1/iteration'),
        $.get('/api/v1/results') ])
    .spread(function(all_people, all_iterations, all_results) {
        var engagement_data = {};  
        var company_data = {};
        var iterations = [];

        _.each(all_people, function(person) {
            var name =  _.map(person.email.split('@')[0].split('\.'), _.capitalize).join(' ');
            engagement_data[person.id] = { 'name' : name, 'values' : {} };
            company_data[person.id] = { 'name' : name, 'values' : {} };  
        });

        _.each(all_results, function(result) {
            iterations.push(result.iteration_id);

            company_data[result.user_id]['values'][result.iteration_id] = result.company;
            engagement_data[result.user_id]['values'][result.iteration_id] = _.floor(_.mean([ 
                    result.fit,
                    result.proud,
                    result.excited,
                    result.meaningful
                ]), 2);
        });

        // use 10 most recent iterations with actual data
        iterations = _.takeRight(_.uniq(iterations).sort(), 10);

        var categories = _(all_iterations).filter(function(iteration) {
            return iterations.indexOf(iteration.id) >= 0;
        }).map('name').value();

        highchartElem($('#engagement-table-container'), 
            'Average Engagement Over Time',
            categories, 
            'Avg. Engagement',
            ' Engagenent',
            buildMapData(engagement_data, iterations));
        highchartElem($('#company-table-container'), 
            'Company Rating',
            categories, 
            'Rating',
            ' Rating',
            buildMapData(company_data, iterations));


        $('#spinner').hide(); 
    });
});

function buildMapData(all_data, iterations) {
    return _.map(all_data, function(result) {
        var name = result.name;
        var data = _.fill(new Array(iterations.length), null);

        _.forIn(result.values, function(value, iteration_id) {
            var index = iterations.indexOf(parseInt(iteration_id));
            if (index >= 0) {
                data[index] = value;
            }
        });
        return { 'name' : name, 'data' : data };
    });
}

function highchartElem(elem, title_text, categories, y_axis_title, tooltip, data) {
    elem.highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: title_text,
            x: -20 //center
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: y_axis_title
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
            valueSuffix: tooltip
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: data
    });   
}