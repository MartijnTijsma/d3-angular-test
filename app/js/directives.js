'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]).
    directive('d3Graph', function() {
        //constants and helpers
        var container = {width: 900, height: 150};
        var margins = {top: 10, right: 20, bottom: 30, left: 60};
        var chartDim = {
            width: container.width - margins.left - margins.right,
            height: container.height - margins.top - margins.bottom
        };

        return {
            restrict: 'E',
                scope: { //attributes bound to the scope
                options: '='
            },
            link:  function (scope, element, attrs) {
                var vis = d3.select(element[0])
                    .append("svg")
                        .attr("width", container.width)
                        .attr("height", container.height)
                    .append("g")
                        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
                        .attr("class","chart");// TODO: replace id, to be more flexible

                scope.$watch('options', function (newVal, oldVal) {
                    //clear all elements inside the directive
                    vis.selectAll('*').remove();

                    //if 'val' is undefined, exit
                    if(newVal == undefined || newVal.subtype == undefined || newVal.data_history == undefined || newVal.color == undefined){
                        return;
                    }

                    var dataHistory = newVal.data_history;

                    var maxValue, interpolationType, ticks;

                    if(newVal.subtype == 'digital'){
                        maxValue = 1;
                        interpolationType = 'step-after';
                        ticks = 1;
                    } else {
                        maxValue = 1000;
                        interpolationType = 'linear';
                        ticks = 4;
                    }

                    var timeScale = d3.time.scale()
                        .range([0, chartDim.width])
                        .domain([dataHistory[0].timestamp, dataHistory[dataHistory.length-1].timestamp]);

                    var countScale = d3.scale.linear()
                        .range([chartDim.height, 0])
                        .domain([0, maxValue]);

                    var timeAxis = d3.svg.axis()
                        .scale(timeScale)
                        .ticks(d3.time.hours, 3)
                        .tickFormat(d3.time.format("%d-%m %H:%M"));

                    var countAxis = d3.svg.axis()
                        .scale(countScale)
                        .ticks(ticks)
                        .orient('left');

                    vis.append('g')
                        .attr('class','x axis')
                        .attr('transform', 'translate(0,'+chartDim.height+')')
                        .call(timeAxis);

                    vis.append('g')
                        .attr('class', 'y axis')
                        .call(countAxis);

                    d3.selectAll('.y.axis')
                        .append('text')
                            .text('value')
                            .attr('transform', 'rotate(-270, 0,0 )')
                            .attr('x', 25)
                            .attr('y', 50);

                    var line = d3.svg.line()
                        .x(function(d){return timeScale(d.timestamp)})
                        .y(function(d){return countScale(d.value)})
                        .interpolate(interpolationType);
                    

                    var area = d3.svg.area()
                        .x(function(d){return timeScale(d.timestamp)})
                        .y0(chartDim.height)
                        .y1(function(d){return countScale(d.value)})
                        .interpolate(interpolationType);


                    var g = d3.select(element[0]).select('.chart')
                        .append('g')
                            .attr('class', 'timeseries '+newVal.color);
                    
                    g.append("path")
                            .attr('d', area(newVal.data_history))
                            .attr('class', 'area');
                    
                    g.append("path")
                            .attr('d', line(newVal.data_history))
                            .attr('class', 'line thin');
                        
                    g.selectAll('circle')
                        .data(newVal.data_history)
                        .enter()
                        .append('circle')
                            .attr('cx', function(d){return timeScale(d.timestamp)})
                            .attr('cy', function(d){return countScale(d.value)})
                            .attr('r', 2);

                    g.selectAll('circle')
                    .on('mouseover', function(d){
                        d3.select(this)
                            .transition()
                            .attr('r', 7);
                    })
                    .on('mouseout', function(d){
                        d3.select(this)
                            .transition()
                            .attr('r', 2);
                    });

                    g.selectAll('circle')
                        .on('mouseover.tooltip', function(d){
                            d3.select('text.tp').remove();
                            d3.select(element[0]).select('.timeseries')
                                .append('text')
                                    .text(d.value)
                                    .attr('x', timeScale(d.timestamp) + 10)
                                    .attr('y', countScale(d.value) - 2)
                                    .attr('class', 'tp');
                        });

                    g.selectAll('circle')
                        .on('mouseout.tooltip', function(d){
                            d3.select('text.tp')
                                .transition()
                                .duration(500)
                                .style("opacity", 0)
                                .attr('transform', 'translate(10, -10)')
                                .remove();
                        });

                });
            }
        }
    }).
    directive('d3AvgGraph', function() {
        //constants and helpers
        var container = {width: 900, height: 300};
        var margins = {top: 10, right: 20, bottom: 30, left: 60};
        var chartDim = {
            width: container.width - margins.left - margins.right,
            height: container.height - margins.top - margins.bottom
        };

        return {
            restrict: 'E',
                scope: { //attributes bound to the scope
                options: '='
            },
            link:  function (scope, element, attrs) {
                var vis = d3.select(element[0])
                    .append("svg")
                        .attr("width", container.width)
                        .attr("height", container.height)
                    .append("g")
                        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
                        .attr("class","chart");// TODO: replace id, to be more flexible

                scope.$watch('options', function (newVal, oldVal) {
                    //clear all elements inside the directive
                    vis.selectAll('*').remove();

                    //if 'val' is undefined, exit
                    if(newVal == undefined || newVal.data_history == undefined){
                        return;
                    }

                    var dataHistory = newVal.data_history;

                    var maxValue = 1000; 
                    var interpolationType = 'linear'; 
                    var ticks = 4;

                    var timeScale = d3.time.scale()
                        .range([0, chartDim.width])
                        .domain([dataHistory[0].timestamp, dataHistory[dataHistory.length-1].timestamp]);

                    var countScale = d3.scale.linear()
                        .range([chartDim.height, 0])
                        .domain([0, maxValue]);
                        //.domain([0, d3.max(newVal, function(d) { return d3.max(d.max); })]);

                    var timeAxis = d3.svg.axis()
                        .scale(timeScale)
                        .ticks(7)
                        .tickFormat(d3.time.format("%d-%m"));

                    var countAxis = d3.svg.axis()
                        .scale(countScale)
                        .ticks(ticks)
                        .orient('left');

                    vis.append('g')
                        .attr('class','x axis')
                        .attr('transform', 'translate(0,'+chartDim.height+')')
                        .call(timeAxis);

                    vis.append('g')
                        .attr('class', 'y axis')
                        .call(countAxis);

                    d3.selectAll('.y.axis')
                        .append('text')
                            .text('value')
                            .attr('transform', 'rotate(-270, 0,0 )')
                            .attr('x', 25)
                            .attr('y', 50);

                    var line = d3.svg.line()
                        .x(function(d){return timeScale(d.timestamp)})
                        .y(function(d){return countScale(d.average)})
                        .interpolate(interpolationType);
                    

                    var area = d3.svg.area()
                        .x(function(d){return timeScale(d.timestamp)})
                        .y0(function(d){return countScale(d.min)})
                        .y1(function(d){return countScale(d.max)})
                        .interpolate(interpolationType);


                    var g = d3.select(element[0]).select('.chart')
                        .append('g')
                            .attr('class', 'timeseries '+newVal.color);
                    
                    g.append("path")
                            .attr('d', area(newVal.data_history))
                            .attr('class', 'area');
                        
                    g.append("path")
                            .attr('d', line(newVal.data_history))
                            .attr('class', 'line');

                });
            }
        }
    })
;
