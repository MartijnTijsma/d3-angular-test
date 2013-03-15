'use strict';

/* Controllers */


function OverviewCtrl($scope, DeviceService) {
    $scope.devices = DeviceService.query();
}

function DetailCtrl($scope, DeviceService) {
    $scope.device = DeviceService.get({deviceId: 'data'})

    $scope.num = 4;
    
}
