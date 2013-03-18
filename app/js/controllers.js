'use strict';

/* Controllers */


function OverviewCtrl($scope, DeviceService) {
    $scope.devices = DeviceService.query();
}

function PortCtrl($scope, DeviceService, $timeout) {
    var refreshTime = 5000; 
    $scope.num = 0;

    $scope.getDeviceData = function(){
        $scope.device = DeviceService.get({deviceId: 'data'});        
    }
/*
    //call refresh data when timer is called, restart
    $scope.onTimeout = function(){
        $scope.getDeviceData();
        refreshDataTimeout = $timeout($scope.onTimeout, refreshTime);
    }
    
    //destroy timer when scope is destroyed
    $scope.$on('$destroy', function() {
        $timeout.cancel(refreshDataTimeout);
    });
    
    //initialize timer
    var refreshDataTimeout = $timeout($scope.onTimeout, refreshTime);
*/
    //initial call
    $scope.getDeviceData();
}

function PortsCtrl($scope, DeviceService, $timeout) {
    var refreshTime = 5000; 

    $scope.getDeviceData = function(){
        $scope.device = DeviceService.get({deviceId: 'data'});        
    }
/*
    //call refresh data when timer is called, restart
    $scope.onTimeout = function(){
        $scope.getDeviceData();
        refreshDataTimeout = $timeout($scope.onTimeout, refreshTime);
    }
    
    //destroy timer when scope is destroyed
    $scope.$on('$destroy', function() {
        $timeout.cancel(refreshDataTimeout);
    });
    
    //initialize timer
    var refreshDataTimeout = $timeout($scope.onTimeout, refreshTime);
*/
    //initial call
    $scope.getDeviceData();
}

function AvgCtrl($scope, DeviceService, $timeout) {
    $scope.getDeviceData = function(){
        $scope.device = DeviceService.get({deviceId: 'average'});        
    }

    $scope.getDeviceData();
}
