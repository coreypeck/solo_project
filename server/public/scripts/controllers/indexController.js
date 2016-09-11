
myApp.controller("indexController", ["$scope", "$http", "FamilyFactory", function($scope, $http, FamilyFactory) {
    var socket = io();
    $scope.chatText = '';
    $scope.gameInput = '';
    $scope.chatHistory = [];
    $scope.eventHistory = [];
    $scope.eventObject = {};
    $scope.familyMembers = [];
    $scope.FamilyFactory = FamilyFactory;
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
            getDescription();
        }, function() {
            console.log("Get Error");
        });
    }

    function getDescription() {
        oneEvent = $scope.eventObject.event
        oneEvent = oneEvent.toLowerCase();
        console.log('/gameplay/' + oneEvent);
        $http({
            method: "GET",
            url: '/gameplay/' + oneEvent,
        }).then(function(response) {
            console.log("Get Success");
            $scope.eventObject.description = response.data[0].description;

            console.log($scope.eventObject);
            console.log($scope.eventObject.event);
            console.log($scope.eventObject.description);

            $scope.eventHistory.push($scope.eventObject);

            while($scope.eventHistory[$scope.eventHistory.length-1] != $scope.eventObject){
              $scope.eventHistory.push($scope.eventObject);
            }
            console.log($scope.eventHistory);
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
            if (inBuilding.inside == true) {
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
        if(userBuilding.toLowerCase() == "next town"){
          $scope.eventObject.event = "Now leaving: ";
          // $scope.eventObject.description = town.townName;
          $scope.eventObject.description = 'town';
          $scope.eventHistory.push($scope.eventObject);
          $scope.buildings = [];
          getTown();
          $scope.gameInput = '';
        }
        else {
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
                  unvisitedArray.push(building)
              }
          });
          $scope.buildings = unvisitedArray;
        }
    }

    function leaveBuilding() {
        inBuilding.inside = false;
        $scope.eventObject = {};
        $scope.eventObject.event = "You have left";
        $scope.eventObject.description = inBuilding.buildingName;
        $scope.eventHistory.push($scope.eventObject);
        resetVariables();
        updateScroll('event_home');
    }

    function resetVariables() {
        $scope.gameInput = '';
        $scope.eventObject = {};
        inBuilding.buildingName = "";
    }

    function getFamilyMembers() {
        $scope.familyDice = "eight";
        $scope.FamilyFactory.getNumber($scope.familyDice).then(function() {
            $scope.FamilyFactory.getMembers().then(function() {
                var familyMembers = $scope.FamilyFactory.grabMembers();
                whoIsInside(familyMembers);
            });
        });
    }


    function getEmotionalModifier() {
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

    function whoIsInside(familyMembers) {
        console.log(familyMembers);
        $scope.eventObject.event = "There are/is ";
        $scope.eventObject.description = (familyMembers.length + " people inside");
        $scope.eventHistory.push($scope.eventObject);
        if($scope.eventHistory[$scope.eventHistory.length-2] == $scope.eventHistory[$scope.eventHistory.length-1]){
          console.log("Deleted the duplicate");
          $scope.eventHistory.pop();
        }
        console.log($scope.eventHistory);
        resetVariables();
        detailedWhoIsInside(familyMembers);
    }

    function detailedWhoIsInside(familyMembers) {
        console.log("detailedWhoIsInside is Called");
        var familyObject = {
            Mother: 0,
            Father: 0,
            Brother: 0,
            Sister: 0
        };
        familyMembers.forEach(function(familyMember) {
            switch (familyMember) {
                case "Mother":
                    familyObject.Mother++;
                    break;
                case "Father":
                    familyObject.Father++;
                    break;
                case "Brother":
                    familyObject.Brother++;
                    break;
                case "Sister":
                    familyObject.Sister++;
                    break;
                default:
                    familyObject.Mother++;
            };
        });
        $scope.eventObject.event = "There are:";
        $scope.eventObject.description = familyObject.Brother + " Brother(s), " + familyObject.Sister + " Sister(s), " + familyObject.Mother + " Mother(s) and " + familyObject.Father + " Father(s)";
        $scope.eventHistory.push($scope.eventObject);
        resetVariables();
    }
}]);
