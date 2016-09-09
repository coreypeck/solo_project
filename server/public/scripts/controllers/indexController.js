//The Object array is what I use to populate my dropdown and, later, use to define my URL

myApp.controller("indexController", ["$scope", "$http", function($scope, $http) {
    var socket = io();
    $scope.chatText = '';
    $scope.chatHistory = [];
    $scope.eventHistory = [];
    $scope.postChat = function() {
        socket.emit('chat message', $scope.chatText);
        $scope.chatHistory.push($scope.chatText);
        $scope.chatText = "";
        return false;
    }
    $scope.buildings = [];
    $scope.event = {};
    $scope.getEvent = function() {
        $http({
            method: "GET",
            url: '/gameplay',
        }).then(function(response) {
            console.log("Get Success");
            // console.log(response);
            $scope.event = response.data[0].description;
            $scope.eventHistory.push($scope.event);
            getDescription($scope.event)
        }, function() {
            console.log("Get Error");
        });
    }

    function getDescription(oneEvent) {
        console.log(oneEvent);
        oneEvent = oneEvent.toLowerCase();
        console.log(oneEvent);
        console.log('/gameplay/' + oneEvent);
        $http({
            method: "GET",
            url: '/gameplay/' + oneEvent,
        }).then(function(response) {
            console.log("Get Success");
            $scope.eventModifier = response.data[0].description;
            console.log($scope.eventModifier);
            $scope.eventHistory.push($scope.eventModifier);
        }, function() {
            console.log("Get Error");
        });
    }
}]);
