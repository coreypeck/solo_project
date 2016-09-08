//The Object array is what I use to populate my dropdown and, later, use to define my URL

myApp.controller("indexController", ["$scope", "$http", function($scope, $http) {
  var socket = io();
  $scope.chatText = '';
  $scope.chatHistory = [];
$scope.postChat = function(){
    socket.emit('chat message', $scope.chatText);
    $scope.chatHistory.push($scope.chatText);
    $scope.chatText = "";
    return false;
}
    $scope.buildings = [{
        building: 'Nerdery'
    }, {
        building: "Prime"
    }, {
        building: 'House_1'
    }];
    // $scope.getPet = function() {
    //
    //     //If I have a value for Selected Item, get the value of that index from my array.
    //
    //     if ($scope.selectedItem != undefined) {
    //         console.log("Scope = ", $scope.selectedItem);
    //         $scope.pettype = $scope.types[$scope.selectedItem].value;
    //         console.log($scope.pettype);
    //     }
    //     var key = '768bbb78142dad544e31c6fa2bfedee0';
    //     var baseURL = 'http://api.petfinder.com/';
    //     var query = baseURL + 'pet.getRandom';
    //     query += '?key=' + key;
    //
    //     //if pettype hasn't been defined by selectedItem, don't add anything
    //
    //     if ($scope.pettype == undefined) {
    //
    //     } else {
    //         query += '&animal=' + $scope.pettype;
    //     }
    //     query += '&output=basic';
    //     query += '&format=json';
    //
    //     console.log('query: ', query);
    //
    //     var request = encodeURI(query) + '&callback=JSON_CALLBACK';
    //     console.log(request);
    //     $http.jsonp(request).then(function(response) {
    //         console.log("Start: am I running?");
    //         var testing = response.data.petfinder.pet;
    //
    //         //If the pet doesn't have a name, description, and one picture, they don't get shown
    //
    //         if (testing.name.$t == undefined || testing.description.$t == undefined || testing.media.photos == undefined || testing.media.photos.photo[2].$t == undefined) {
    //             console.log("if: am I running?");
    //             $scope.getPet();
    //         } else {
    //             $scope.animal = response.data.petfinder.pet;
    //             console.log("else: am I running?");
    //             $scope.getFaves();
    //         }
    //     });
    // }
    //
    // //On page Load, run getPet
    //
    // angular.element(document).ready($scope.getPet);
    //
    // $scope.postFavorite = function() {
    //     console.log($scope.animal);
    //     var description = $scope.animal.description.$t.substring(0, 96);
    //     description += "...";
    //     console.log(description);
    //
    //     //Constructs Animal Object to send to the server. I grabbed the ID in case I wanted to make a request for a specific animal in the future
    //
    //     var request = {
    //         id: $scope.animal.id.$t,
    //         name: $scope.animal.name.$t,
    //         photo: $scope.animal.media.photos.photo[2].$t,
    //         description: description
    //     }
    //     console.log(request);
    //     $http({
    //         method: "POST",
    //         url: '/faves',
    //         data: request,
    //     }).then(function() {
    //         console.log("Added to Favorites!");
    //         $scope.getFaves();
    //     }, function() {
    //         console.log("Post Error");
    //     });
    // }
    //
    // //Same function I use for my favorites page, but this is only used for the .length. The rest of the data is lost to JS
    //
    // $scope.getFaves = function() {
    //     $http({
    //         method: "GET",
    //         url: '/faves',
    //     }).then(function(response) {
    //         console.log("Get Success");
    //         // console.log(response);
    //         $scope.favNumber = response.data;
    //         $scope.favNumber = $scope.favNumber.length
    //         console.log($scope.favNumber);
    //     }, function() {
    //         console.log("Get Error");
    //     });
    // }
}]);
