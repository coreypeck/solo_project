myApp.controller("indexController", ["$scope", "$http", "$timeout", "FamilyFactory", function($scope, $http, $timeout, FamilyFactory) {

    //Socket io is used for my chat interface

    var socket = io();
    $scope.chatText = '';
    $scope.gameInput = '';
    $scope.chatHistory = [];
    $scope.eventHistory = [];
    $scope.FamilyFactory = FamilyFactory;
    $scope.fighting = false;
    $scope.fight = [{
        image: '../imgs/circle.png'
    }, {
        image: '../imgs/circle.png'
    }, {
        image: '../imgs/pc/alberto.png'
    }, {
        image: '../imgs/npc/badpeople/oldwomanmafia/darthsidious.png'
    }, {
        image: '../imgs/circle.png'
    }, {
        image: '../imgs/circle.png'
    }, ];
    $scope.background = {
        image: ""
    };
    var inBuilding = {
        inside: false,
        buildingName: ""
    }
    var hasVoted = false;
    var isVoting = false;
    var yesVotes = 0;
    var noVotes = 0;
    var insultsArray = [];
    var holdingObjectArray = [];
    var insultNum = 0;
    var fightPosition = 2;
    var heardOfWando = false;
    var townsVisited = 0;
    var completedQuests = 0;
    var naratorImg = "../imgs/blanca.png"
    var wandoQuestAt = [5, 10, 20, 40];
    var wandoTier = 1;
    var wandoCount = 0;
    var metWando = false;
    var wandoIntro = "You follow the roads until you reach Wando's clearing. You see a small Wagon hooked up to two large Oxen. Wando looks to be an old man with mad scientist hair. Wando looks up from the book he was reading and regards you. You see in his gaze great wisdom, and more than a bit of insanity";

    function updateSuccessStatus() {
        $scope.submitSuccess = {
            'border': '5px solid green'
        };
        $timeout(function() {
            $scope.submitSuccess = {
                'border': '2px solid black'
            };
        }, 5000);
    }
    //initial town generation
    $scope.FamilyFactory.getUser().then(function() {
        $scope.FamilyFactory.getNumber('unknown1').then(function() {
            var index = $scope.FamilyFactory.grabNumber();
            console.log(index);
            $scope.userImage = $scope.FamilyFactory.grabImage(index - 1);
            console.log($scope.userImage);
        });
    });
    getTown();

    //The function that shows my local chat

    $scope.postChat = function() {
        socket.emit('chat message', $scope.chatText);
        // $scope.chatHistory.push($scope.chatText);
        updateScroll('chatHome');
        $scope.chatText = "";
        return false;
    }

    socket.on('chat message', function(msg) {
        console.log("recieving message");
        $scope.chatHistory.push(msg);
        console.log($scope.chatHistory);
        $scope.$apply();
    });

    function sendEventToIo(data) {
        socket.emit("event", data);
        updateScroll('chatHome');
        return false;
    }

    function sendBuildingToIo(data) {
        socket.emit("building", data);
        updateScroll('chatHome');
        return false;
    }

    function submitVote() {
        var data = {
            yes: yesVotes,
            no: noVotes
        };
        socket.emit("vote", data);
        hasVoted = true;
        updateScroll('chatHome');
        return false;
    }

    function resetVote() {
        var data = {
            yes: 0,
            no: 0,
            votingStatus: false,
            voteStatus: false
        }
        socket.emit("vote reset", data);
        updateScroll('chatHome');
        return false;
    }
    var el = document.getElementById('server-time');

    socket.on('time', function(timeString) {
        el.innerHTML = 'Server time: ' + timeString;
    });
    socket.on('event', function(msg) {
        $scope.eventHistory.push(msg);
        console.log("msg", msg);
        console.log(msg.description);
        if (msg.description.substring(msg.description.length - 5, msg.description.length) == "Vote!") {
            isVoting = true
        }
        console.log(msg.description.substring(msg.description.length - 5, msg.description.length));
        console.log($scope.eventHistory);
        $scope.$apply();
    });
    socket.on('building', function(msg) {
        $scope.building = msg;
        console.log($scope.eventHistory);
        $scope.$apply();
    });
    socket.on('vote', function(msg) {
        yesVotes += msg.yes;
        noVotes += msg.no;
        console.log($scope.eventHistory);
        $scope.$apply();
    });
    socket.on("vote reset", function(data) {
        yesVotes = data.yes;
        noVotes = data.no;
        isVoting = data.votingStatus;
        hasVoted = data.voteStatus;
    });
    //This will bring focus to the bottom of a given ID...usually

    function updateScroll(id) {
        var element = document.getElementById(id);
        element.scrollTop = element.scrollHeight;
    }

    //the ajax for my town

    function getTown() {
        console.log("getTown running");
        var buildingNumber = 0;
        townsVisited++;
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
            if (townsVisited == 3) {
                var eventObject = {
                    "event": "As you enter this new town, a stranger brushes roughly past you.",
                    "description": "When your anger subsides, you notice a piece a paper in your hand. It says: 'Find Wando and he will aid you'",
                    "image": naratorImg
                };
                heardOfWando = true;
                sendEventToIo(eventObject);
                // $scope.eventHistory.push(eventObject);
            }
        }, function() {
            console.log("Get Error");
        });
    }

    function wandoCheck(bName) {
        console.log(bName);
        if (bName == "Wando" && heardOfWando == false) {
            $scope.FamilyFactory.getGuildName().then(function() {
                bName = $scope.FamilyFactory.grabGuildName();
                wandoCheck(bName);
            });
        } else if (bName == "Wando" && wandoCount == 1) {
            $scope.FamilyFactory.getGuildName().then(function() {
                bName = $scope.FamilyFactory.grabGuildName();
                wandoCheck(bName);
            });
        } else if (bName == "Wando" || bName == "Church") {
            wandoCount = 1;
            enumerateBuilding(bName);
        } else {
            bName += " Guild";
            enumerateBuilding(bName);
        }
    }


    //This does an Ajax request to grab the Event name

    function getBuildings(buildingNumber) {
        console.log("getBuildings");
        console.log(buildingNumber);
        $scope.buildings = [];
        var bName = "";

        //I did this for consistency. So even the first iteration of a building has a number

        for (var i = 0; i < buildingNumber; i++) {
            $http({
                method: "GET",
                url: '/gameplay/buildings'
            }).then(function(buildingName) {
                    console.log("Get Success");
                    // var test = 'Wando';
                    // wandoCheck(test);
                    if (buildingName.data[0].description == "Guild") {
                        $scope.FamilyFactory.getGuildName().then(function() {
                            bName = $scope.FamilyFactory.grabGuildName();
                            wandoCheck(bName);
                        });
                    } else {
                        bName = buildingName.data[0].description;
                        enumerateBuilding(bName);
                    };
                },
                function() {
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
        if (bName !== "Wando") {
            bName += ("_" + repeats);
        }
        $scope.buildings.push(bName);
        $scope.buildings.sort();
    }

    //Checks to see if what was entered was a command

    $scope.checkCommand = function() {
        if ($scope.fighting == true) {
            var choice = $scope.gameInput;
            checkComeback(choice);
            updateSuccessStatus();
        } else {
            if (isVoting == true) {
                var checkYes = $scope.gameInput.substring(0, 3);
                var checkNo = $scope.gameInput.substring(0, 2);
                if (checkYes.toLowerCase() == 'yes' && hasVoted == false) {
                    yesVotes++;
                    hasVoted = true;
                    resetVariables();
                    updateSuccessStatus();
                } else if (checkNo.toLowerCase() == 'no' && hasVoted == false) {
                    noVotes++;
                    hasVoted = true;
                    resetVariables();
                    updateSuccessStatus();
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
                        updateSuccessStatus();
                    }
                } else {
                    console.log("Quit typing in nonsense ya Goof!");
                }
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
                        "description": "",
                        "image": naratorImg
                    };
                    eventObject.event = 'building';
                    eventObject.description = building;
                    startVote(eventObject);
                } else {
                    unvisitedArray.push(building)
                }
            });
            $scope.buildings = unvisitedArray;
        }
    }

    function enterBuilding(building) {
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        inBuilding.inside = true;
        inBuilding.buildingName = building;
        if (inBuilding.buildingName == "Wando") {
            if (metWando == false) {
                metWando = true;
                eventObject.description = wandoIntro;
                sendEventToIo(eventObject);
                // $scope.eventHistory.push(eventObject);
            } else {
                $scope.FamilyFactory.getNumber().then(function() {
                    var wandoActionNumber = $scope.FamilyFactory.grabNumber();
                    $scope.FamilyFactory.getWandoAction(wandoActionNumber).then(function() {
                        var wandoAction = $scope.FamilyFactory.grabWandoAction();
                        eventObject.description = wandoAction;
                        sendEventToIo(eventObject);
                        // $scope.eventHistory.push(eventObject);
                    });
                });
            }
            //This will pull from an array of Wando Cook-i-ness
            //It will describe what Wando is doing when you interrupt him
            //Wando will check the status of your quest and, if you have
            //met one or more of the tier goals, he will give you some worthless incentive
            //if you clear the last objective, he gives you the sword of something or another
        } else {
            eventObject.event = "You have entered";
            eventObject.description = inBuilding.buildingName;
            sendEventToIo(eventObject);
            // $scope.eventHistory.push(eventObject);
            resetVariables();
            getFamilyMembers();
        }
    }

    //this function is called when the user types in leave

    function leaveBuilding() {
        inBuilding.inside = false;
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        eventObject.event = "You have left";
        eventObject.description = inBuilding.buildingName;
        sendEventToIo(eventObject);
        // $scope.eventHistory.push(eventObject);
        resetVariables();
        updateScroll('event_home');
    }

    //I use this as an easy way to reset key variables

    function resetVariables() {
        $scope.gameInput = '';
        inBuilding.buildingName = "";
    }

    //this is run to get the amount of family members and who they are

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
        holdingObjectArray = [];
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        eventObject.event = "You see ";
        eventObject.description = (familyMembers.length + " people inside.");
        holdingObjectArray.push(eventObject);
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
            "description": "",
            "image": naratorImg
        };
        eventObject.event = "It looks like: ";
        eventObject.description = familyObject.Brother + " Brother(s), " + familyObject.Sister + " Sister(s), " + familyObject.Mother + " Mother(s) and " + familyObject.Father + " Father(s)";
        holdingObjectArray.push(eventObject);
        console.log(holdingObjectArray);
        var object = {
            "event": (holdingObjectArray[0].event + holdingObjectArray[0].description),
            "description": (holdingObjectArray[1].event + holdingObjectArray[1].description)
        };
        holdingObjectArray = [];
        sendEventToIo(eventObject);
        // $scope.eventHistory.push(object);
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
        holdingObjectArray = [];
        var number = familyMembers.length;
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        $scope.FamilyFactory.getNumber("unknown" + number).then(function() {
            var randomFamilyMember = $scope.FamilyFactory.grabNumber();
            var ranFamMem = familyMembers[(randomFamilyMember - 1)];
            eventObject.event = "A " + ranFamMem.age_sex_name + " approaches You. ";
            eventObject.description = ranFamMem.gender + " looks " + emotion;
            holdingObjectArray.push(eventObject);
            getEvent();
        });
    }

    function checkWandoQuests() {
        wandoQuestAt.forEach(function(section, index) {
            if (completedQuests < section) {
                console.log(section - completedQuests + " more successful quests until section " + index + "is complete");
            }
        });
    }

    //Gets the event

    function getEvent() {
        var ajaxArray = [];
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
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
                                holdingObjectArray.push(eventObject);
                            } else {
                                eventObject.event = ajaxArray[0].event;
                                eventObject.description = (ajaxArray[0].description + questFamilyMember[0].description);
                                holdingObjectArray.push(eventObject);
                            }
                            var actionCall = $scope.FamilyFactory.getCallToAction();
                            if (holdingObjectArray[1].event.substring(0, 16) == "I  want to Fight") {
                                var object = {
                                    "event": (holdingObjectArray[0].event + " " + holdingObjectArray[0].description),
                                    "description": (holdingObjectArray[1].event + " " + holdingObjectArray[1].description)
                                };
                                sendEventToIo(eventObject);
                                // $scope.eventHistory.push(object);
                                startFight();
                            } else {
                                var object = {
                                    "event": (holdingObjectArray[0].event + " " + holdingObjectArray[0].description),
                                    "description": (holdingObjectArray[1].event + " " + holdingObjectArray[1].description + actionCall.event + actionCall.description)
                                };
                                sendEventToIo(eventObject);
                                // $scope.eventHistory.push(object);
                                var route = "help";
                                startVote(route);

                                resetVariables();
                                updateScroll('event_home');
                            }
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
            "description": "",
            "image": naratorImg
        };
        if (routeCommand == "next town") {
            eventObject.event = "A player has voted to go to the " + routeCommand;
            eventObject.description = "Please enter Yes or No within 15s to cast your Vote!";
            sendEventToIo(eventObject);
            // $scope.eventHistory.push(eventObject);
            updateScroll('event_home');
            $timeout(function() {
                if (yesVotes > noVotes) {
                    resetVote();
                    // isVoting = false;
                    wandoCount = 0;
                    moveNewTown();
                } else {
                    var eventObject = {
                        "event": "",
                        "description": "",
                        "image": naratorImg
                    };
                    resetVote();
                    eventObject.event = "The vote ";
                    eventObject.description = "has failed.";
                    sendEventToIo(eventObject);
                    // $scope.eventHistory.push(eventObject);
                    updateScroll('event_home');
                    resetVariables();
                }
            }, 20000);
        } else if (routeCommand == 'help') {
            eventObject.event = "A citizen calls for aid! Will you aid them?";
            eventObject.description = "Please enter Yes or No within 15s to cast your Vote!";
            sendEventToIo(eventObject);
            // $scope.eventHistory.push(eventObject);
            updateScroll('event_home');
            $timeout(function() {
                if (yesVotes > noVotes) {
                    resetVote();
                    console.log("Fine, I'll help!");
                    getStory();
                } else {
                    var eventObject = {
                        "event": "",
                        "description": "",
                        "image": naratorImg
                    };
                    resetVote();

                    eventObject.event = "The vote ";
                    eventObject.description = "has failed.";
                    sendEventToIo(eventObject);
                    // $scope.eventHistory.push(eventObject);
                    showDismay();
                    updateScroll('event_home');
                    resetVariables();
                }
            }, 20000);
            updateScroll('event_home');
        } else if (routeCommand.event == 'building') {
            var eventObject = {
                "event": "",
                "description": "",
                "image": naratorImg
            };
            eventObject.event = "A player wants to enter " + routeCommand.description;
            eventObject.description = "Please enter Yes or No within 15s to cast your Vote!";
            sendEventToIo(eventObject);
            // $scope.eventHistory.push(eventObject);
            updateScroll('event_home');
            $timeout(function() {
                if (yesVotes > noVotes) {
                    resetVote();

                    console.log("Alons-e!");
                    enterBuilding(routeCommand.description);
                } else {
                    var eventObject = {
                        "event": "",
                        "description": "",
                        "image": naratorImg
                    };
                    resetVote();

                    eventObject.event = "The vote ";
                    eventObject.description = "has failed.";
                    sendEventToIo(eventObject);
                    // $scope.eventHistory.push(eventObject);
                    updateScroll('event_home');
                    resetVariables();
                }
            }, 20000);
            updateScroll('event_home');
        }
    }

    function showDismay() {
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        eventObject.event = "They look rather disappointed and, not so, kindly";
        eventObject.description = " show you the door. There is an audible click behind you as they lock it.";
        sendEventToIo(eventObject);
        // $scope.eventHistory.push(eventObject);
        updateScroll('event_home');
        leaveBuilding();
    }

    function moveNewTown() {
        yesVotes = 0;
        noVotes = 0;
        hasVoted = false;
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        eventObject.event = "Now leaving: ";
        // eventObject.description = town.townName;
        eventObject.description = 'town';
        sendEventToIo(eventObject);
        // $scope.eventHistory.push(eventObject);
        $scope.buildings = [];
        getTown();
        $scope.gameInput = '';
        updateScroll('event_home');
    }

    function showGraditude() {
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        eventObject.event = "You are thanked profusely and invited to stay for supper.";
        eventObject.description = " You politely decline. They thank you once move and you leave.";
        sendEventToIo(eventObject);
        // $scope.eventHistory.push(eventObject);
        completedQuests++;
        updateScroll('event_home');
        leaveBuilding();
    }

    function swordToTheFace() {

    }

    function getStory() {
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        $scope.FamilyFactory.actionRouting().then(function() {
            var ajaxArray = $scope.FamilyFactory.grabHistory();
            console.log(ajaxArray);
            eventObject.event = ajaxArray[0].event;
            eventObject.description = ajaxArray[0].description;
            sendEventToIo(eventObject);
            // $scope.eventHistory.push(eventObject);
            console.log("Action has been routing!");
            yesVotes = 0;
            noVotes = 0;
            hasVoted = false;
            $scope.gameInput = '';
            doQuest();
        });
    }

    function doQuest() {
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        var success = false;
        $scope.FamilyFactory.getResult().then(function() {
            var ajaxArray = $scope.FamilyFactory.grabHistory();
            eventObject.event = ajaxArray[0].event;
            eventObject.description = ajaxArray[0].description;
            console.log(eventObject.event);
            if (eventObject.event == "Success: ") {
                success = true;
            }
            sendEventToIo(eventObject);
            // $scope.eventHistory.push(eventObject);
            if (success == true) {
                showGraditude();
            } else {
                showDismay();
            }
        });
    }

    function startFight() {
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        console.log("fight is running")
        $scope.FamilyFactory.getNumber('six').then(function() {
            var imgNum = $scope.FamilyFactory.grabNumber();
            $scope.background.image = ("../imgs/background/fight_background_" + imgNum + ".jpg");
        });
        // $scope.FamilyFactory.getOpponent().then(function() {
        //     $scope.FamilyFactory.getNumber('four').then(function() {
        //         var opponent = $scope.FamilyFactory.grabOpponent();
        //     });
        // });
        $scope.fighting = true;
        eventObject.event = "Type 1, 2 or 3 ";
        eventObject.description = "to select your Comeback!";
        sendEventToIo(eventObject);
        // $scope.eventHistory.push(eventObject);
        getInsults();
    }

    function getInsults() {
        $scope.FamilyFactory.getInsults().then(function() {
            insultsArray = $scope.FamilyFactory.grabInsults();
            console.log(insultsArray);
            $scope.FamilyFactory.getNumber('unknown3').then(function() {
                insultNum = $scope.FamilyFactory.grabNumber();
                insultNum--;
                var eventObject = {
                    "event": "",
                    "description": "",
                    "image": naratorImg
                };
                console.log(insultNum);
                eventObject.event = insultsArray[insultNum].insult;
                insultNum++;
                sendEventToIo(eventObject);
                // $scope.eventHistory.push(eventObject);
                var choices = [{
                    number: '1: ',
                    comeback: insultsArray[0].comeback
                }, {
                    number: '2: ',
                    comeback: insultsArray[1].comeback
                }, {
                    number: '3: ',
                    comeback: insultsArray[2].comeback
                }];
                choices.forEach(function(choice) {
                    var choiceObject = {
                        "event": "",
                        "description": ""
                    };
                    choiceObject.event = choice.number;
                    choiceObject.description = choice.comeback;
                    console.log(choiceObject);
                    sendEventToIo(choiceObject);
                    // $scope.eventHistory.push(choiceObject);
                    updateScroll('event_home');
                });
                updateScroll('event_home');
            });
            updateScroll('event_home');
        });
    }

    function checkComeback(choice) {
        if (choice == insultNum) {
            console.log("Keep going!");
            $scope.fight.splice(fightPosition + 2, 1);
            $scope.fight.unshift({
                image: '../imgs/circle.png'
            });
            fightPosition++;
            $scope.gameInput = '';
            checkPosition();
        } else if (choice != insultNum && choice <= 3 && choice >= 1) {
            console.log("Focus now!");
            $scope.fight.splice(fightPosition - 1, 1);
            $scope.fight.push({
                image: '../imgs/circle.png'
            });
            fightPosition--;
            $scope.gameInput = '';
            checkPosition(choice);
        } else {
            console.log("Pick ONE of the THREE Numbers Doofus!");
            $scope.gameInput = '';
        }
    }

    function checkPosition(choice) {
        var eventObject = {
            "event": "",
            "description": "",
            "image": naratorImg
        };
        var ajaxArray = undefined;
        choice = parseInt(choice);
        if (fightPosition == 0 || fightPosition == 4) {
            if (fightPosition == 0) {
                console.log("You lost");
                $scope.fighting = false;
                $scope.loss = true;
                fightPosition = 2;
                $timeout(function() {
                    $scope.loss = false;
                    $scope.FamilyFactory.getFightQuote('2').then(function() {
                        ajaxArray = $scope.FamilyFactory.grabHistory();
                        console.log(ajaxArray);
                        eventObject.event = ajaxArray[0].event;
                        eventObject.description = ajaxArray[0].description;
                        sendEventToIo(eventObject);
                        // $scope.eventHistory.push(eventObject);
                        leaveBuilding();
                    });
                }, 20000)
            } else if (fightPosition == 4) {
                console.log("You won!");
                $scope.fighting = false;
                $scope.victory = true;
                fightPosition = 2;
                $timeout(function() {
                    $scope.victory = false;
                    $scope.FamilyFactory.getFightQuote('1').then(function() {
                        ajaxArray = $scope.FamilyFactory.grabHistory();
                        eventObject.event = ajaxArray[1].event;
                        eventObject.description = ajaxArray[1].description;
                        sendEventToIo(eventObject);
                        // $scope.eventHistory.push(eventObject);
                        leaveBuilding();
                    });
                }, 5000)
            }
        } else {
            getInsults();
            updateScroll('event_home');
            $scope.gameInput = '';
        }
    }
    var buildingClick = -1;
    $scope.fillWithBuilding = function() {
        buildingClick++;
        if (buildingClick >= $scope.buildings.length) {
            buildingClick = 0;
        }
        $scope.simpleSelect = "Go " + $scope.buildings[buildingClick];
    }
}]);

//TODO
//Add pictures to things that are being said
//Finish Wando quests
//Story intro (Superimposed DIV Probably)
//Styling
//completed quest counter?
//update Building IO push
//IO rooms, don't start until all players are in. This will help make sure the buildings match up
//Make voting an io call. So other players can interact as well!
//Maybe do a push and return each vote as it happens, push that to an array and then do a for loop iteration?
