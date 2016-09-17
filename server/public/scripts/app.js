var myApp = angular.module('myApp', []);

myApp.controller('UserController', ['$scope', '$http', '$window', 'FamilyFactory' function($scope, $http, $window, FamilyFactory) {
    $scope.userName = {
      username: "",
      image: ""
    };
    $scope.FamilyFactory = FamilyFactory;

    // This happens after page load, which means it has authenticated if it was ever going to
    // NOT SECURE
    $http.get('/user').then(function(response) {
        if(response.data) {
            $scope.userName.username = response.data.username;
            $scope.userName.username = response.data.image;
            console.log($scope.username);
            console.log('User Data: ', $scope.userName);
        } else {
            $window.location.href = '/index.html';
        }
    });
}]);
