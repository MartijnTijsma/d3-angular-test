'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/overview', {templateUrl: 'partials/overview.html', controller: MyCtrl1});
        $routeProvider.when('/detail', {templateUrl: 'partials/detail.html', controller: MyCtrl2});
        $routeProvider.otherwise({redirectTo: '/overview'});
  }]);