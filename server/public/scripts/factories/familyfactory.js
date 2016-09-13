myApp.factory('FamilyFactory', ['$http', function($http) {

    // Private
    //Setting necessary variables
    var familyNumber = undefined;
    var familyMembers = [];
    var eventHistory = [];
    var emotion = "";
    var questPrompt = {
        "event": "",
        "description": ""
    };
    var stand_in = "";
    var guildName = "";

    var questPromptEvent = function(relative) {
        eventHistory = [];
        var additionalText = "";
        var relativeInNeed = "";
        var secondaryRelative = "";
        if (stand_in == "wants_to_fight") {
            additionalText = "I ";
        } else {
            additionalText = "My ";
            familyNumber = 1;
            numberOfMembers().then(function() {
                relativeInNeed = relative[0].description;
                console.log(relativeInNeed);
            });
        }
        var promise = $http({
            method: "GET",
            url: '/gameplay/firstevent/' + stand_in,
        }).then(function(response) {
            console.log("Get Success");
            var description = response.data[0].description;
            if (description.substring(description.length - 3, description.length) == "...") {
                console.log(relative);
                description = description.substring(0, description.length - 3)
                if(stand_in!='in_love'){
                  description += (" " + relative[0].gender);
                }
                console.log(description);
            }
            var questString = additionalText + relativeInNeed + description;
            console.log(questString);
            questPrompt.event = questString;
        }, function() {
            console.log("Get Error");
        });
        return promise;
    };

    var questPromptDescription = function(relative) {
        console.log("stand_in", stand_in);
        var promise = $http({
            method: "GET",
            url: '/gameplay/secondevent/' + stand_in,
        }).then(function(response) {
                console.log("Get Success");
                console.log(response.data[0].id);
                console.log(relative[0].pronoun);
                var description = response.data[0].description;
                if (stand_in == "in_love") {
                    switch (response.data[0].id) {
                        case 1:
                        description = relative[0].pronoun + " " + description;
                            break;
                        case 2:
                            description = relative[0].pronoun + " " + description;
                            break;
                        case 3:
                        console.log(relative[0].pronoun_two);
                            description = relative[0].pronoun_two + " " + description;
                            break;
                    }
                }
                var savePerson = relative;
                checkStandIn(stand_in, savePerson, response, description);
            },
            function() {
                console.log("Get Error");
            });
        return promise;
    };

    var checkStandIn = function(stand_in, savePerson, response, description) {
        console.log("Save Person", savePerson);
        var des = description;
        switch (stand_in) {
            case 'kidnapped':
                switch (response.data[0].id) {
                    case 1:
                        familyNumber = 1;
                        numberOfMembers().then(function() {
                            des += savePerson[0].pronoun + " " + familyMembers[0].description;
                        });
                }
                break;
            case 'financial_issues':
                switch (response.data[0].id) {
                    case 2:
                        //robbed factor call
                        break;
                    case 3:
                        des += " " + savePerson[0].pronoun + " job";
                        break;
                    case 4:
                        des += " " + savePerson[0].pronoun + " debts";
                }
                break;
            case 'murdered':
                switch (response.data[0].id) {
                    case 3:
                        des += " " + savePerson[0].pronoun + " bills";
                        break;
                    case 4:
                        des += " " + savePerson[0].pronoun;
                        familyNumber = 1;
                        numberOfMembers().then(function() {
                            des += familyMembers[0].description;
                        });
                }
                break;
            case 'in_love':
                switch (response.data[0].id) {
                    case 1:
                        familyNumber = 1;
                        numberOfMembers().then(function() {
                            des += familyMembers[0].description;
                        });
                }
                break;
            case 'wants_to_fight':
                switch (response.data[0].id) {
                    case 4:
                        familyNumber = 1;
                        numberOfMembers().then(function() {
                            des += familyMembers[0].description;
                        });
                }
        }
        des = des.replace('...','');
        questPrompt.description = des;
        console.log(des);
        console.log(questPrompt);
        eventHistory.push(questPrompt);
    }

    //this is my number getter. The 'd' stand for Die or Dice

    var assignNumber = function(number) {
        familyNumber = undefined;
        var promise = $http({
            method: "GET",
            url: '/gameplay/d/' + number,
        }).then(function(response) {
            console.log("Get Success");
            familyNumber = parseInt(response.data);
        }, function() {
            console.log("Get Error");
        });
        return promise;
    }

    //Grabs the number of Family members

    var numberOfMembers = function() {
        familyMembers = [];
        for (var i = 0; i < familyNumber; i++) {
            var promise = $http({
                method: "GET",
                url: '/gameplay/members',
            }).then(function(response) {
                console.log("getFamilyMembers Get Success");
                familyMembers.push(response.data[0]);
            }, function() {
                console.log("Get Error");
            });
        }
        return promise;
    }

    //I set EventObject in the beginning just to make sure I don't accidently recieve previous data

    var getEvent = function() {
        eventObject = {
            "event": "",
            "description": ""
        };
        var promise = $http({
            method: "GET",
            url: '/gameplay',
        }).then(function(response) {
            console.log("Get Success");
            eventObject = {
                "event": "",
                "description": ""
            };
            stand_in = response.data[0].description.toLowerCase();
            console.log(stand_in);
        }, function() {
            console.log("Get Error");
        });
        return promise;
    }

    //Everyone needs emotions! It's a key part of Story telling!

    var getEmotion = function() {
        emotion = "";
        var promise = $http({
            method: "GET",
            url: '/gameplay/emotions',
        }).then(function(response) {
            console.log("Get Success");
            emotion = response.data[0].emotion;
        }, function() {
            console.log("Get Error");
        });
        return promise;
    }

    var getGuildName = function() {
        var promise = $http({
            method: "GET",
            url: '/gameplay/guilds'
        }).then(function(gName) {
            guildName = gName.data[0].description;
            console.log("getGuildName", guildName);
        }, function() {
            console.log("Get Error");
        });
        return promise;
    }

    var voteRouting = function(voteRoute) {
        var promise = $http({
            method: "POST",
            url: '/gameplay/' + voteRoute
        }).then(function() {
            console.log("POST Success!");
        }, function() {
            console.log("POST Error");
        });
        return promise;
    }



    return {
        getNumber: function(number) {
            return assignNumber(number);
        },
        grabNumber: function() {
            return familyNumber;
        },
        getMembers: function() {
            return numberOfMembers();
        },
        grabMembers: function() {
            return familyMembers;
        },
        getQuest: function() {
            return getEvent();
        },
        grabHistory: function() {
            return eventHistory;
        },
        getEmotion: function() {
            return getEmotion();
        },
        grabEmotion: function() {
            return emotion;
        },
        questPromptEvent: function(relative) {
            return questPromptEvent(relative);
        },
        questPromptDescription: function(relative) {
            return questPromptDescription(relative);
        },
        getGuildName: function() {
            return getGuildName();
        },
        grabGuildName: function() {
            return guildName;
        },
        voteRouting: function(voteRoute) {
            return voteRouting(voteRoute);
        }
    };

}]);
