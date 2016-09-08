
//A GET call to grab all my favorites.

myApp.controller("favesController", ["$scope", "$http", function($scope, $http) {
    console.log("Am I runnin?");
    $scope.favNumber = 0;
    $scope.getFaves = function() {
        $http({
            method: "GET",
            url: '/faves',
        }).then(function(response) {
          var myEl = angular.element(document.querySelector('#homeHome'));
          myEl.empty();
            console.log("Get Success");

            //I get the number from the .length of what I get from the DB. I did It in several steps to ensure it got in how I wanted it

            $scope.favorites = response.data;
            $scope.favNumber = $scope.favorites;
            $scope.favNumber = $scope.favNumber.length
            console.log($scope.favorites);
        }, function() {
            console.log("Get Error");
        });
    }

    //When the page loads, fun this function

    angular.element(document).ready($scope.getFaves);

    $scope.deleteFav = function(id) {
      if(confirm("Delete this task??!")) {
        console.log('delete task id ', id);
        $http.delete('/faves/' + id).then(function(response) {
          if(response.status == 202) {
            $scope.getFaves();
          } else {
            console.log('error deleting task');
          }
        });
      };
  }
}]);
