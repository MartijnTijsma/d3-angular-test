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
        var container = {width: 900, height: 400};
        var margins = {top: 10, right: 20, bottom: 30, left: 60};
        var chartDim = {
            width: container.width - margins.left - margins.right,
            height: container.height - margins.top - margins.bottom
        };
        var end = new XDate();
        var start = end.clone().addDays(-1);

        return {
            restrict: 'E',
                scope: { //attributes bound to the scope
                data: '='
            },
            link:  function (scope, element, attrs) {
                var vis = d3.select(element[0])
                    .append("svg")
                        .attr("width", container.width)
                        .attr("height", container.height)
                    .append("g")
                        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
                        .attr("id","chart");// TODO: replace id, to be more flexible

                scope.$watch('data', function (newVal, oldVal) {
                    //clear all elements inside the directive
                    vis.selectAll('*').remove();

                    //if 'val' is undefined, exit
                    if(!newVal){
                        return;
                    }

                    var timeScale = d3.time.scale()
                        .range([0, chartDim.width])
                        .domain([newVal[0].timestamp, newVal[newVal.length-1].timestamp]);

                    var countScale = d3.scale.linear()
                        .range([chartDim.height, 0])
                        .domain([0,1000]);

                    var timeAxis = d3.svg.axis()
                        .scale(timeScale);

                    var countAxis = d3.svg.axis()
                        .scale(countScale)
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
                            .text('status')
                            .attr('transform', 'rotate(-270, 0,0 )')
                            .attr('x', 100)
                            .attr('y', 50);

                    var line = d3.svg.line()
                        .x(function(d){return timeScale(d.timestamp)})
                        .y(function(d){return countScale(d.value)})
                        .interpolate('linear');

                    var g = d3.select('#chart') // TODO: replace id
                        .append('g')
                        .attr('id', 'path-1')
                        .attr('class', 'timeseries');

                    g.append("path")
                        .attr('d', line(newVal));

                });
            }
        }
    })
;
