'use strict';

/* Services */

angular.module('myApp.services', ['ngResource']).
    factory('DeviceService', function($resource){
        return $resource('data/:deviceId.json', {}, {
            query: {method:'GET', params:{deviceId:'devices'}, isArray:true}
    });
});
