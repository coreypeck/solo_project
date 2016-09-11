myApp.controller("indexController", ["$scope", "$http", "FamilyFactory", function($scope, $http, FamilyFactory) {

    //Socket io is used for my chat interface

    var socket = io();
    $scope.chatText = '';
    $scope.gameInput = '';
    $scope.chatHistory = [];
    $scope.eventHistory = [];
    $scope.eventObject = {
        "event": "",
        "description": ""
    };
    $scope.FamilyFactory = FamilyFactory;
    var inBuilding = {
        inside: false,
        buildingName: ""
    }

    //initial town generation

    getTown();

    //The function that shows my local chat

    $scope.postChat = function() {
        socket.emit('chat message', $scope.chatText);
        $scope.chatHistory.push($scope.chatText);
        $scope.chatText = "";
        updateScroll('chatHome');
        return false;
    }

    //This will bring focus to the bottom of a given ID...usually

    function updateScroll(id) {
        var element = document.getElementById(id);
        element.scrollTop = element.scrollHeight;
    }

    //the ajax for my town

    function getTown() {
        var buildingNumber = 0;
        $http({
            method: "GET",
            url: '/gameplay/town',
        }).then(function(response) {
            console.log("Get Success");

            //I did a switch for spacial optimization

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

            //This will tell us how many buildings to grab

            getBuildings(buildingNumber);
        }, function() {
            console.log("Get Error");
        });
    }

    //This does an Ajax request to grab the Event name

    function getBuildings(buildingNumber) {
        $scope.buildings = [];

        //I did this for consistency. So even the first iteration of a building has a number

        var repeats = 1;
        for (var i = 0; i < buildingNumber; i++) {
            $http({
                method: "GET",
                url: '/gameplay/buildings'
            }).then(function(buildingName) {
                var bName = buildingName.data[0].description;

                //This renames the building if another of its kind exists

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

    //Checks to see if what was entered was a command

    $scope.checkCommand = function() {

        //These will always evaluate to go or leave if the first thing they put is was go or leave

        var checkGo = $scope.gameInput.substring(0, 2);
        var checkLeave = $scope.gameInput.substring(0, 5);
        if (checkGo.toLowerCase() == 'go') {

            //Players can't go somewhere else if they haven't left yet

            if (inBuilding.inside == true) {
                console.log("You have to leave the building you are in first");
            } else {
                console.log("You typed in go. The next step is to check the building!");
                checkBuilding($scope.gameInput.substring(3, $scope.gameInput.length));
            }
        } else if (checkLeave.toLowerCase() == 'leave') {
            console.log("You typed in leave. Cya!");
            leaveBuilding()
        } else {
            console.log("Quit typing in nonsense ya Goof!");
        }
    }

    //Since we know a command keyword was entered, we need to check if the building is valid as well

    function checkBuilding(userBuilding) {
        var unvisitedArray = [];

        //Since go and go next town both start with go, I needed to check for next town BEFORE I checked the building

        if (userBuilding.toLowerCase() == "next town") {
            $scope.eventObject.event = "Now leaving: ";
            // $scope.eventObject.description = town.townName;
            $scope.eventObject.description = 'town';
            $scope.eventHistory.push($scope.eventObject);
            $scope.buildings = [];
            getTown();
            $scope.gameInput = '';
        } else {
            $scope.buildings.forEach(function(building, index) {

                //This checks for a matching building in toLowerCase so the user doesn't have to worry about the case

                if (userBuilding.toLowerCase() == building.toLowerCase()) {
                    console.log("We got a match!");
                    $scope.eventObject = {
                        "event": "",
                        "description": ""
                    };
                    inBuilding.inside = true;
                    inBuilding.buildingName = building;
                    $scope.eventObject.event = "You have entered";
                    $scope.eventObject.description = inBuilding.buildingName;
                    $scope.eventHistory.push($scope.eventObject);
                    resetVariables();
                    getFamilyMembers();
                } else {
                    unvisitedArray.push(building)
                }
            });
            $scope.buildings = unvisitedArray;
        }
    }


    //this function is called when the user types in leave

    function leaveBuilding() {
        inBuilding.inside = false;
        $scope.eventObject = {
            "event": "",
            "description": ""
        };
        $scope.eventObject.event = "You have left";
        $scope.eventObject.description = inBuilding.buildingName;
        $scope.eventHistory.push($scope.eventObject);
        resetVariables();
        updateScroll('event_home');
    }

    //I use this as an easy way to reset key variables

    function resetVariables() {
        $scope.gameInput = '';
        $scope.eventObject = {
            "event": "",
            "description": ""
        };
        inBuilding.buildingName = "";
    }

    //this is run to get the amount of faimly members and who they are

    function getFamilyMembers() {
        $scope.fullFamilyDetails = [];

        //I decided to use the word as I don't have to worry about converting to a string and back to a usable number

        $scope.familyDice = "eight";
        $scope.FamilyFactory.getNumber($scope.familyDice).then(function() {
            $scope.FamilyFactory.getMembers().then(function() {
                var familyMembers = $scope.FamilyFactory.grabMembers();
                whoIsInside(familyMembers);
            });
        });
    }

    function whoIsInside(familyMembers) {
        $scope.eventObject.event = "You see ";
        $scope.eventObject.description = (familyMembers.length + " people inside");
        $scope.eventHistory.push($scope.eventObject);

        //The code would randomly push a second eventObject, so I had this in place to make sure it didn't get away with it

        if ($scope.eventHistory[$scope.eventHistory.length - 2] == $scope.eventHistory[$scope.eventHistory.length - 1]) {
            console.log("Deleted the duplicate");
            $scope.eventHistory.pop();
        }
        resetVariables();
        detailedWhoIsInside(familyMembers);
    }

    //gets the count of how many of ezch family member type

    function detailedWhoIsInside(familyMembers) {
        var familyObject = {
            Mother: 0,
            Father: 0,
            Brother: 0,
            Sister: 0
        };
        familyMembers.forEach(function(familyMember) {
            switch (familyMember.description) {
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
        $scope.eventObject.event = "It looks like:";
        $scope.eventObject.description = familyObject.Brother + " Brother(s), " + familyObject.Sister + " Sister(s), " + familyObject.Mother + " Mother(s) and " + familyObject.Father + " Father(s)";
        $scope.eventHistory.push($scope.eventObject);
        getEmotions(familyMembers);
        resetVariables();
    }

    function getEmotions(familyMembers) {
        $scope.FamilyFactory.getEmotion().then(function() {
            var emotion = $scope.FamilyFactory.grabEmotion();
            makeDialogue(emotion, familyMembers);
        });
    }

    //Using the family we have generated and the event that has occured, we can now make cohesive sentences!

    function makeDialogue(emotion, familyMembers) {
        var number = familyMembers.length;
        number = number.toString();
        $scope.FamilyFactory.getNumber("unknown" + number).then(function() {
            var randomFamilyMember = $scope.FamilyFactory.grabNumber();
            var ranFamMem = familyMembers[(randomFamilyMember - 1)];
            $scope.eventObject.event = "A " + ranFamMem.age_sex_name + " approaches You. ";
            $scope.eventObject.description = ranFamMem.gender + " looks " + emotion;
            $scope.eventHistory.push($scope.eventObject);
            $scope.getEvent(familyMembers);
        });
    }

    //Gets the event

    $scope.getEvent = function(familyMembers) {
      var array = $scope.eventHistory;
      var ajaxArray = [];
        $scope.FamilyFactory.getEvent().then(function() {
            $scope.FamilyFactory.questPromptEvent().then(function() {
                $scope.FamilyFactory.questPromptDescription().then(function() {
                    ajaxArray = $scope.FamilyFactory.grabHistory();
                    console.log(array);
                    array.push(ajaxArray[0]);
                    console.log(array);
                    updateScroll('event_home');
                });
            });
        });
    }
}]);
