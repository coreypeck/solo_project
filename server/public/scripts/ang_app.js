var myApp = angular.module('myApp', ['ngRoute']);

// Routes that change the partial based on what we want to view

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/game', {
            templateUrl: '/views/partials/game.html',
            controller: "indexController"
        })
        .otherwise({
            redirectTo: 'game'
        })
}]);
