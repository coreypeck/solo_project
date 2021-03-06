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
    var questDifficulty = undefined;
    var successNumber = undefined;
    var insults = [];
    var fightQuote = "";
    var wandoAction = "";
    var userName = {
        username: "",
        image: ""
    };
    var userImageArray = [];
    var questId = "";

    var getUser = function() {
      var promise = $http.post('/user').then(function(response) {
            if (response.data) {
                userName.username = response.data.username;
                userName.image = response.data.image;
                console.log('User Data: ', userName);
                userImageArray.push(userName.image);
            }
        });
        return promise;
    }

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
        });
    }
    var promise = $http({
        method: "POST",
        url: '/gameplay/firstevent/' + stand_in,
    }).then(function(response) {
        console.log("Get Success");
        var description = response.data[0].description;
        if (description.substring(description.length - 3, description.length) == "...") {
            description = description.substring(0, description.length - 3)
            if (stand_in != 'in_love') {
                description += (" " + relative[0].gender);
            }
        }
        var questString = additionalText + relativeInNeed + description;
        questPrompt.event = questString;
    }, function() {
        console.log("Get Error");
    });
    return promise;
};

var questPromptDescription = function(relative) {
    var promise = $http({
        method: "POST",
        url: '/gameplay/secondevent/' + stand_in,
    }).then(function(response) {
            var description = response.data[0].description;
            questDifficulty = response.data[0].id;
            console.log("questDifficulty", questDifficulty);
            if (stand_in == "in_love") {
                switch (response.data[0].id) {
                    case 1:
                        description = relative[0].pronoun + " " + description;
                        break;
                    case 2:
                        description = relative[0].pronoun + " " + description;
                        break;
                    case 3:
                        description = relative[0].pronoun_two + description;
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
    var des = description;
    switch (stand_in) {
        case 'kidnapped':
            switch (response.data[0].id) {
                case 1:
                    des += " " + savePerson[0].pronoun + " Cousin";
            }
            break;
        case 'financial_issues':
            switch (response.data[0].id) {
                case 2:
                    $http({
                        method: "POST",
                        url: '/gameplay/secondevent/robbed',
                    }).then(function(response) {
                        des += response.data[0].description;
                    });
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
                    des += " " + savePerson[0].pronoun + " ";
                    des += "Cousin";
            }
            break;
        case 'in_love':
            switch (response.data[0].id) {
                case 1:
                    des += "Cousin";
            }
            break;
        case 'wants_to_fight':
            switch (response.data[0].id) {
                case 4:
                    des += "Cousin";
            }
    }
    des = des.replace('...', '');
    questPrompt.description = des;
    eventHistory.push(questPrompt);
    questId = response.data[0].id;
}

//this is my number getter. The 'd' stand for Die or Dice

var assignNumber = function(number) {
    familyNumber = undefined;
    var promise = $http({
        method: "POST",
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
            method: "POST",
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
    var eventObject = {
        "event": "",
        "description": "",
        "image": ""
    };
    var promise = $http({
        method: "POST",
        url: '/gameplay',
    }).then(function(response) {
        console.log("Get Success");
        var eventObject = {
            "event": "",
            "description": "",
            "image": ""
        };
        console.log(response);
        stand_in = response.data[0].description.toLowerCase();
    }, function() {
        console.log("Get Error");
    });
    return promise;
}

//Everyone needs emotions! It's a key part of Story telling!

var getEmotion = function() {
    emotion = "";
    var promise = $http({
        method: "POST",
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
        method: "POST",
        url: '/gameplay/guilds'
    }).then(function(gName) {
        guildName = gName.data[0].description;
    }, function() {
        console.log("Get Error");
    });
    return promise;
}

var actionRouting = function() {
    eventHistory = [];
    console.log(stand_in);
    console.log(questDifficulty.toString());
    if (stand_in == "wants_to_fight") {
        console.log("Cool fight starts now!");
    } else if (stand_in == "illness" || stand_in == "lost" || stand_in == "robbed") {
        var promise = $http({
            method: "POST",
            url: '/gameplay/action/' + stand_in + "_" + questDifficulty.toString() + "_" + questId
        }).then(function(response) {
            console.log("POST Success!");
            console.log(response);
            questId = response.data[0].id;
            if (stand_in == "robbed") {
                var questPrompt = {
                    "event": "Internally:",
                    "description": response.data[0].description,
                    "image": ""
                };
                eventHistory.push(questPrompt);
            } else {
                var questPrompt = {
                    "event": "One More Thing! ",
                    "description": response.data[0].description,
                    "image": ""
                };
                eventHistory.push(questPrompt);
            }
        }, function() {
            console.log("POST Error");
        });
        return promise;
    } else {
        var promise = $http({
            method: "POST",
            url: '/gameplay/action/' + stand_in + "_" + questDifficulty.toString() + "_" + questId
        }).then(function(response) {
            console.log("POST Success!");
            console.log(response);
            questId = response.data[0].id;
            var questPrompt = {
                "event": "One More Thing! ",
                "description": response.data[0].description,
                "image": ""
            };
            eventHistory.push(questPrompt);
        }, function() {
            console.log("POST Error");
        });
        return promise;
    }
}
var proposition = function() {
    var questPrompt = {
        "event": " Will you",
        "description": " help?",
        "image": ""
    };
    return questPrompt;
}
var attemptSuccess = function() {
    eventHistory = [];
    console.log(stand_in);
    console.log(questDifficulty.toString());
    if (stand_in == "illness" || stand_in == "lost" || stand_in == "robbed") {
        var promise = $http({
            method: "POST",
            url: '/gameplay/success/' + stand_in + "_" + questDifficulty.toString() + "_" + questId
        }).then(function(response) {
            console.log("POST Success!");
            console.log(response);
            if (response.data[0].id % 2 == 0) {
                var questPrompt = {
                    "event": "Failure: ",
                    "description": response.data[0].description,
                    "image": ""
                };
            } else {
                var questPrompt = {
                    "event": "Success: ",
                    "description": response.data[0].description,
                    "image": ""
                };
            }
            eventHistory.push(questPrompt);
        }, function() {
            console.log("POST Error");
        });
        return promise;
    } else {
        var promise = $http({
            method: "POST",
            url: '/gameplay/success/' + stand_in + "_" + questDifficulty.toString() + "_" + questId
        }).then(function(response) {
            console.log("POST Success!");
            console.log(response);
            if (response.data[0].id % 2 == 0) {
                var questPrompt = {
                    "event": "Failure: ",
                    "description": response.data[0].description,
                    "image": ""
                };
            } else {
                var questPrompt = {
                    "event": "Success: ",
                    "description": response.data[0].description,
                    "image": ""
                };
            }
            eventHistory.push(questPrompt);
        }, function() {
            console.log("POST Error");
        });
        return promise;
    }
}
var getInsults = function() {
    var counter = 0;
    insults = [];
    console.log(insults.length);
    for (var i = 0; i < 6; i++) {
        var promise = $http({
            method: "POST",
            url: '/gameplay/insults'
        }).then(function(response) {
            var repeats = 0;
            insults.forEach(function(insult) {
                if (response.data[0].id == insult.id) {
                    repeats++;
                }
            });
            if (repeats == 0) {
                insults.push(response.data[0]);
            }
        }, function() {
            console.log("Get Error");
        });
    }
    return promise;
}

var getFightQuote = function(success) {
  console.log(stand_in);
    var promise = $http({
        method: "POST",
        url: '/gameplay/fight_success/' + stand_in + "_" + questDifficulty + success
    }).then(function(response) {
        console.log("POST Success!");
        console.log(response);
        if (response.data[0].id % 2 == 0) {
            var questPrompt = {
                "event": "Failure: ",
                "description": response.data[0].description,
                "image": ""
            };
            eventHistory.push(questPrompt);
        } else {
            var questPrompt = {
                "event": "Success: ",
                "description": response.data[0].description,
                "image": ""
            };
            eventHistory.push(questPrompt);
        }
    }, function() {
        console.log("POST Error");
    });
    return promise;
}

var getWandoAction = function(number) {
    var promise = $http({
        method: "POST",
        url: '/gameplay/wando/' + number
    }).then(function(response) {
        console.log("POST Success!");
        console.log(response);
        wandoAction = response.data[0].description;
    }, function() {
        console.log("POST Error");
    });
    return promise;
}


return {
    getUser: function(){
      return getUser();
    },
    grabImage: function(index){
      return userImageArray[index];
    },
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
    actionRouting: function() {
        return actionRouting();
    },
    getCallToAction: function() {
        return proposition();
    },
    getResult: function() {
        return attemptSuccess();
    },
    getInsults: function() {
        return getInsults();
    },
    grabInsults: function() {
        return insults;
    },
    getFightQuote: function(id) {
        return getFightQuote(id);
    },
    getWandoAction: function(number) {
        return getWandoAction(number);
    },
    grabWandoAction: function() {
        return wandoAction;
    }
};
}]);
