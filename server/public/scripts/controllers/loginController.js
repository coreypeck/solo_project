myApp.controller('LoginController', ['$scope', '$http', '$location', '$timeout', function($scope, $http, $location, $timeout) {
    $scope.user = {
      username: '',
      password: '',
      image: ''
    };
    $scope.message = '';
    $scope.selection = 0;
    var clicked = false;
    var pictureArray = [
      "../imgs/pc/alberto.png",
      "../imgs/pc/arabianboy.png",
      "../imgs/pc/arlington.png",
      "../imgs/pc/darion.png",
      "../imgs/pc/dart.png",
      "../imgs/pc/dayita.png",
      "../imgs/pc/delynn.png",
      "../imgs/pc/devil.png",
      "../imgs/pc/egyptiangirl.png",
      "../imgs/pc/egyptianqueen.png",
      "../imgs/pc/fey.png",
      "../imgs/pc/gothloli1.png",
      "../imgs/pc/gothloli2.png",
      "../imgs/pc/jael.png",
      "../imgs/pc/kavi.png",
      "../imgs/pc/mandar.png",
      "../imgs/pc/miko.png",
      "../imgs/pc/moderngirl02.png",
      "../imgs/pc/moderngirl03.png",
      "../imgs/pc/moderngirl04.png",
      "../imgs/pc/modernguy02.png",
      "../imgs/pc/modernguy05.png",
      "../imgs/pc/officeman2.png",
      "../imgs/pc/officewoman5.png",
      "../imgs/pc/prince.png",
      "../imgs/pc/randomgirl.png",
      "../imgs/pc/roshan.png",
      "../imgs/pc/schoolboy.png",
      "../imgs/pc/sirelmo.png",
      "../imgs/pc/tremel.png"];
      $scope.picture = pictureArray[$scope.selection];
      $scope.adjustSelectionUp = function(){
        console.log("up is running");
        $scope.selection++;
        if($scope.selection >= pictureArray.length){
          $scope.selection = 0;
        }
        $scope.picture = pictureArray[$scope.selection];
        clicked = true;
        $timeout(function(){
          clicked = false;
        }, 2000);
      }
      $scope.adjustSelectionDown = function(){
        console.log("down is running");
        $scope.selection--;
        if($scope.selection < 0){
          $scope.selection = pictureArray.length-1;
        }
        $scope.picture = pictureArray[$scope.selection];
        clicked = true;
        $timeout(function(){
          clicked = false;
        }, 1000);
      }

    $scope.login = function() {
      if($scope.user.username == '' || $scope.user.password == '') {
        $scope.message = "Enter your username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/', $scope.user).then(function(response) {
          if(response.data.username) {
            console.log('success: ', response.data);
            // location works with SPA (ng-route)
            console.log('redirecting to user page');
            $location.path('/user');
          } else {
            console.log('failure: ', response);
            $scope.message = "Wrong!!";
          }
        });
      }
    }

    $scope.registerUser = function() {
      if(clicked == true){
        return;
      }
      else if($scope.user.username == '' || $scope.user.password == '') {
        $scope.message = "Choose a username and password!";
      } else {
        $scope.user.image = $scope.picture;
        console.log('sending to server...', $scope.user);
        $http.post('/register', $scope.user).then(function(response) {
          console.log('success');
          $location.path('/home');
        },
        function(response) {
          console.log('error');
          $scope.message = "Please try again."
        });
      }
    }
}]);
