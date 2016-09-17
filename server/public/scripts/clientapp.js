var myApp = angular.module('myApp', ['ngRoute']);

// Routes that change the partial based on what we want to view

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: '/views/home.html',
            controller: "LoginController"
        })
        //resolve
        .when('/register', {
            templateUrl: '/views/register.html',
            controller: "LoginController"
        })
        .when('/user', {
            templateUrl: '/views/partials/game.html',
            controller: "indexController"
        })
        .otherwise({
            redirectTo: 'home'
        })

}]);
