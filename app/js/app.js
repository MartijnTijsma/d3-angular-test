'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/overview', {templateUrl: 'partials/overview.html', controller: OverviewCtrl});
        $routeProvider.when('/ports', {templateUrl: 'partials/ports.html', controller: PortsCtrl});
        $routeProvider.when('/port', {templateUrl: 'partials/port.html', controller: PortCtrl});
        $routeProvider.when('/averages', {templateUrl: 'partials/averages.html', controller: AvgCtrl});
        $routeProvider.otherwise({redirectTo: '/overview'});
  }]);
