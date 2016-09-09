//The Object array is what I use to populate my dropdown and, later, use to define my URL

myApp.controller("indexController", ["$scope", "$http", function($scope, $http) {
    var socket = io();
    $scope.chatText = '';
    $scope.gameInput = '';
    $scope.chatHistory = [];
    $scope.eventHistory = [];
    $scope.eventObject = {};
    $scope.familyMembers = [];
    var inBuilding = {
        inside: false,
        buildingName: ""
    }
    getTown();
    $scope.postChat = function() {
        socket.emit('chat message', $scope.chatText);
        $scope.chatHistory.push($scope.chatText);
        $scope.chatText = "";
        updateScroll('chatHome');
        return false;
    }

    function updateScroll(id) {
        var element = document.getElementById(id);
        element.scrollTop = element.scrollHeight;
    }

    function getTown() {
        var buildingNumber = 0;
        $http({
            method: "GET",
            url: '/gameplay/town',
        }).then(function(response) {
            console.log("Get Success");
            console.log(response.data[0].building_type);
            switch (response.data[0].building_type) {
                case "Caravan":
                    buildingNumber = 5;
                    break;
                case "Small":
                    buildingNumber = 10;
                    break;
                case "Medium":
                    buildingNumber = 15;
                    break;
                case "Large":
                    buildingNumber = 20;
                    break;
                default:
                    buildingNumber = 5;
            }
            console.log(buildingNumber);
            getBuildings(buildingNumber);
        }, function() {
            console.log("Get Error");
        });
    }

    $scope.getEvent = function() {
        $http({
            method: "GET",
            url: '/gameplay',
        }).then(function(response) {
            console.log("Get Success");
            $scope.eventObject = {};
            $scope.eventObject.event = response.data[0].description;
            getDescription()
        }, function() {
            console.log("Get Error");
        });
    }

    function getDescription() {
        oneEvent = $scope.eventObject.event
        console.log(oneEvent);
        oneEvent = oneEvent.toLowerCase();
        console.log(oneEvent);
        console.log('/gameplay/' + oneEvent);
        $http({
            method: "GET",
            url: '/gameplay/' + oneEvent,
        }).then(function(response) {
            console.log("Get Success");
            $scope.eventObject.description = response.data[0].description;
            console.log($scope.eventObject);
            $scope.eventHistory.push($scope.eventObject);
            updateScroll('event_home');
        }, function() {
            console.log("Get Error");
        });
    }

    function getBuildings(buildingNumber) {
        $scope.buildings = [];
        var repeats = 1;
        for (var i = 0; i < buildingNumber; i++) {
            console.log("I'm Running in the For Loop");
            $http({
                method: "GET",
                url: '/gameplay/buildings'
            }).then(function(buildingName) {
                var bName = buildingName.data[0].description;
                $scope.buildings.forEach(function(building) {
                    if (bName == building || bName == building.substring(0, building.length - 2) || bName == building.substring(0, building.length - 3)) {
                        repeats++;
                    }
                });
                bName += ("_" + repeats);
                $scope.buildings.push(bName);
                $scope.buildings.sort();
                repeats = 1;
            }, function() {
                console.log("Get Error");
            });
        }
    }
    $scope.checkCommand = function() {
        var checkGo = $scope.gameInput.substring(0, 2);
        var checkLeave = $scope.gameInput.substring(0, 5);
        if (checkGo.toLowerCase() == 'go') {
            if (inBuilding == true) {
                console.log("You have to leave the building you are in first");
            } else {
                console.log("You typed in go. The next step is to check the building!");
                checkBuilding($scope.gameInput.substring(3, $scope.gameInput.length));
            }
        } else if (checkLeave.toLowerCase() == 'leave') {
            console.log("You typed in leave. The next step is to check the building!");
            leaveBuilding()
        } else {
            console.log("Quit typing in nonsense ya Goof!");
        }
    }

    function checkBuilding(userBuilding) {
        var unvisitedArray = [];
        $scope.buildings.forEach(function(building, index) {
            if (userBuilding.toLowerCase() == building.toLowerCase()) {
                console.log("We got a match!");
                $scope.eventObject = {};
                inBuilding.inside = true;
                inBuilding.buildingName = building;
                $scope.eventObject.event = "You have entered";
                $scope.eventObject.description = inBuilding.buildingName;
                $scope.eventHistory.push($scope.eventObject);
                resetVariables();
                getFamilyMembers();
                $scope.getEvent();
            } else {
                console.log("These buildings don't match");
                unvisitedArray.push(building)
            }
        });
        $scope.buildings = unvisitedArray;
    }

    function leaveBuilding() {
        inBuilding.inside = false;
        $scope.eventObject = {};
        $scope.eventObject.event = "You have left";
        $scope.eventObject.description = inBuilding.buildingName;
        $scope.eventHistory.push($scope.eventObject);
        resetVariables();
    }

    function resetVariables() {
        $scope.gameInput = '';
        $scope.eventObject = {};
        inBuilding.buildingName = "";
    }

    function getFamilyMembers() {
      console.log("getFamilyMembers runs");
        var numberOfMembers = getNumber("eight");
        console.log("numberOfMembers", numberOfMembers);
        for (var i = 0; i < numberOfMembers; i++) {
          console.log("getFamilyMembers for loop");
            $http({
                method: "GET",
                url: '/gameplay/members',
            }).then(function(response) {
                console.log("getFamilyMembers Get Success");
                console.log(response);
                $scope.familyMembers.push(response);
                console.log("Family Member's Array", $scope.familyMembers);
                whoIsInside();
                detailedWhoIsInside();
            }, function() {
                console.log("Get Error");
            });
        }

        // var arrayIndex = getNumber('eight');
        // var emotion = getEmotionalModifier();
        // $scope.eventObject.event = ;
        // $scope.eventObject.description = $scope.familyMembers.length + " inside";
        // $scope.eventHistory.push($scope.eventObject);
    }
    function getEmotionalModifier(){
      $http({
          method: "GET",
          url: '/gameplay/emotion',
      }).then(function(response) {
          console.log("Get Success");
          console.log("Emotion!", response.data);
      }, function() {
          console.log("Get Error");
      });
    }
    function getNumber(number) {
        $http({
            method: "GET",
            url: '/gameplay/d/' + number,
        }).then(function(response) {
            console.log("Get Success");
            console.log("random 1-8 number: ",response.data)
            console.log(parseInt(response.data));
            return parseInt(response.data);
        }, function() {
            console.log("Get Error");
        });
    }
    function whoIsInside(){
      $scope.eventObject.event = "There are ";
      $scope.eventObject.description = $scope.familyMembers.length + " people inside";
      $scope.eventHistory.push($scope.eventObject);
      resetVariables();
    }
    function detailedWhoIsInside(){
      console.log("detailedWhoIsInside is Called");
      var familyObject = {};
      $scope.familyMembers.forEach(function(familyMember){
        $scope.familyMembers.forEach(function(familyType){
          if(familyMember == familyType){
            familyObject.familyType += 1;
            console.log("Family Object", familyObject);
          }
        });
      });
      $scope.eventObject.event = "There are:";
      $scope.eventObject.description = familyObject.Brother + " Brother(s), " + familyObject.Sister + " Sister(s), " + familyObject.Mother + " Mother(s) and " + familyObject.Father + " Father(s)";
      $scope.eventHistory.push($scope.eventObject);
      resetVariables();
    }
}]);
