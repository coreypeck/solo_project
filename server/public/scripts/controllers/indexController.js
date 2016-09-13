myApp.controller("indexController", ["$scope", "$http", "$timeout", "FamilyFactory", function($scope, $http, $timeout, FamilyFactory) {

    //Socket io is used for my chat interface

    var socket = io();
    $scope.chatText = '';
    $scope.gameInput = '';
    $scope.chatHistory = [];
    $scope.eventHistory = [];
    $scope.FamilyFactory = FamilyFactory;
    var inBuilding = {
        inside: false,
        buildingName: ""
    }
    var hasVoted = false;
    var isVoting = false;
    var yesVotes = 0;
    var noVotes = 0;
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
        var bName = "";

        //I did this for consistency. So even the first iteration of a building has a number

        for (var i = 0; i < buildingNumber; i++) {
            $http({
                method: "GET",
                url: '/gameplay/buildings'
            }).then(function(buildingName) {
                if (buildingName.data[0].description == "Guild") {
                    $scope.FamilyFactory.getGuildName().then(function() {
                        bName = $scope.FamilyFactory.grabGuildName();
                        bName += " Guild";
                        enumerateBuilding(bName);
                    });
                } else {
                    bName = buildingName.data[0].description;
                    enumerateBuilding(bName);
                };
            }, function() {
                console.log("Get Error");
            });
        }
    }

    function enumerateBuilding(bName) {
        var repeats = 1;

        //This renames the building if another of its kind exists

        $scope.buildings.forEach(function(building) {
            if (bName == building || bName == building.substring(0, building.length - 2) || bName == building.substring(0, building.length - 3)) {
                repeats++;
            }
        });
        bName += ("_" + repeats);
        $scope.buildings.push(bName);
        $scope.buildings.sort();
    }

    //Checks to see if what was entered was a command

    $scope.checkCommand = function() {

        if (isVoting == true) {
            var checkYes = $scope.gameInput.substring(0, 3);
            var checkNo = $scope.gameInput.substring(0, 2);
            if (checkYes.toLowerCase() == 'yes' && hasVoted == false) {
                yesVotes++;
                hasVoted = true;
                resetVariables();
            } else if ($scope.gameInput.substring(0, 2) == 'no' && hasVoted == false) {
                noVotes++;
                hasVoted = true;
                resetVariables();
            } else if (hasVoted == true) {
                console.log("You already voted, don't get greedy!");
            } else {
                console.log("You are supposed to be voting right now");
            }
        } else {

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
                if (inBuilding.inside == false) {
                    console.log("You have to enter a building before you can leave it");
                } else {
                    console.log("You typed in leave. Time for the Vote!");
                    leaveBuilding();
                }
            } else {
                console.log("Quit typing in nonsense ya Goof!");
            }
        }
    }

    //Since we know a command keyword was entered, we need to check if the building is valid as well

    function checkBuilding(userBuilding) {
        var unvisitedArray = [];

        //Since go and go next town both start with go, I needed to check for next town BEFORE I checked the building

        if (userBuilding.toLowerCase() == "next town") {
            startVote(userBuilding.toLowerCase());
        } else {
            $scope.buildings.forEach(function(building, index) {

                //This checks for a matching building in toLowerCase so the user doesn't have to worry about the case

                if (userBuilding.toLowerCase() == building.toLowerCase()) {
                    var eventObject = {
                        "event": "",
                        "description": ""
                    };
                    inBuilding.inside = true;
                    inBuilding.buildingName = building;
                    eventObject.event = "You have entered";
                    eventObject.description = inBuilding.buildingName;
                    $scope.eventHistory.push(eventObject);
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
        var eventObject = {
            "event": "",
            "description": ""
        };
        eventObject.event = "You have left";
        eventObject.description = inBuilding.buildingName;
        $scope.eventHistory.push(eventObject);
        resetVariables();
        updateScroll('event_home');
    }

    //I use this as an easy way to reset key variables

    function resetVariables() {
        $scope.gameInput = '';
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
        var eventObject = {
            "event": "",
            "description": ""
        };
        eventObject.event = "You see ";
        eventObject.description = (familyMembers.length + " people inside");
        $scope.eventHistory.push(eventObject);

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
        var eventObject = {
            "event": "",
            "description": ""
        };
        eventObject.event = "It looks like:";
        eventObject.description = familyObject.Brother + " Brother(s), " + familyObject.Sister + " Sister(s), " + familyObject.Mother + " Mother(s) and " + familyObject.Father + " Father(s)";
        $scope.eventHistory.push(eventObject);
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
        var eventObject = {
            "event": "",
            "description": ""
        };
        $scope.FamilyFactory.getNumber("unknown" + number).then(function() {
            var randomFamilyMember = $scope.FamilyFactory.grabNumber();
            var ranFamMem = familyMembers[(randomFamilyMember - 1)];
            eventObject.event = "A " + ranFamMem.age_sex_name + " approaches You. ";
            eventObject.description = ranFamMem.gender + " looks " + emotion;
            $scope.eventHistory.push(eventObject);
            getEvent();
        });
    }

    //Gets the event

    function getEvent() {
        var ajaxArray = [];
        var eventObject = {
            "event": "",
            "description": ""
        };
        var questFamilyMember = undefined;
        $scope.FamilyFactory.getQuest().then(function() {
            $scope.FamilyFactory.getNumber('four').then(function() {
                $scope.FamilyFactory.getMembers().then(function() {
                    var relative = $scope.FamilyFactory.grabMembers();
                    $scope.FamilyFactory.questPromptEvent(relative).then(function() {
                        $scope.FamilyFactory.questPromptDescription(relative).then(function() {
                            ajaxArray = $scope.FamilyFactory.grabHistory();
                            if (ajaxArray[0].description.substring(ajaxArray[0].description.length - 3, ajaxArray[0].description.length) == "...") {
                                questFamilyMember = relative
                            }
                            if (questFamilyMember == undefined) {
                                eventObject.event = ajaxArray[0].event;
                                eventObject.description = ajaxArray[0].description;
                                $scope.eventHistory.push(eventObject);
                            } else {
                                eventObject.event = ajaxArray[0].event;
                                eventObject.description = (ajaxArray[0].description + questFamilyMember[0].description);
                                $scope.eventHistory.push(eventObject);
                            }
                            var actionCall = $scope.FamilyFactory.getCallToAction();
                            $scope.eventHistory.push(actionCall);
                            var route = "help";
                            startVote(route);

                            resetVariables();
                            updateScroll('event_home');
                        });
                    });
                });
            });
        });
    }

    function startVote(routeCommand) {
        resetVariables();
        isVoting = true;
        var eventObject = {
            "event": "",
            "description": ""
        };
        if (routeCommand == "next town") {
            eventObject.event = "A player has voted to go to the " + routeCommand;
            eventObject.description = "Please enter Yes or No within 15s to cast your Vote!";
            $scope.eventHistory.push(eventObject);
            updateScroll('event_home');
            $timeout(function() {
                if (yesVotes > noVotes) {
                    isVoting = false;
                    moveNewTown();
                } else {
                    var eventObject = {
                        "event": "",
                        "description": ""
                    };
                    yesVotes = 0;
                    noVotes = 0;
                    isVoting = false;
                    hasVoted = false;
                    eventObject.event = "The vote ";
                    eventObject.description = "has failed.";
                    $scope.eventHistory.push(eventObject);
                    updateScroll('event_home');
                    resetVariables();
                }
            }, 5000);
        } else if(routeCommand == 'help'){
          eventObject.event = "A citizen calls for aid! Will you aid them?";
          eventObject.description = "Please enter Yes or No within 15s to cast your Vote!";
          $scope.eventHistory.push(eventObject);
          updateScroll('event_home');
          $timeout(function() {
              if (yesVotes > noVotes) {
                  isVoting = false;
                  console.log("Fine, I'll help!");
                  getStory();
              } else {
                  var eventObject = {
                      "event": "",
                      "description": ""
                  };
                  yesVotes = 0;
                  noVotes = 0;
                  isVoting = false;
                  hasVoted = false;
                  eventObject.event = "The vote ";
                  eventObject.description = "has failed.";
                  $scope.eventHistory.push(eventObject);
                  updateScroll('event_home');
                  resetVariables();
              }
          }, 5000);
        }
    }

    function moveNewTown() {
        yesVotes = 0;
        noVotes = 0;
        hasVoted = false;
        var eventObject = {
            "event": "",
            "description": ""
        };
        eventObject.event = "Now leaving: ";
        // eventObject.description = town.townName;
        eventObject.description = 'town';
        $scope.eventHistory.push(eventObject);
        $scope.buildings = [];
        getTown();
        $scope.gameInput = '';
        updateScroll('event_home');
    }

    function swordToTheFace() {

    }
    function getStory(){
      $scope.FamilyFactory.actionRouting().then(function(){
        console.log("Action has been routing!");
      })
    }
}]);
