'use strict';

/* Controllers */


function OverviewCtrl($scope, DeviceService) {
    $scope.devices = DeviceService.query();
}

function DetailCtrl($scope, DeviceService) {
    
    
}
