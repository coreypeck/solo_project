myApp.factory('FamilyFactory', ['$http', function($http) {
    console.log("family factory running");

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

    var questPromptEvent = function() {
      eventHistory = [];
      console.log(stand_in);
      var additionalText = "";
      var relativeInNeed = "";
      var secondaryRelative = "";
      if(stand_in == "wants_to_fight"){
        additionalText = "I ";
      }else{
        additionalText = "My ";
        familyNumber = 1;
        numberOfMembers().then(function(){
          console.log(familyMembers);
          relativeInNeed = familyMembers[0].description;
          console.log(relativeInNeed);
        });
      }
      var promise = $http({
          method: "GET",
          url: '/gameplay/firstevent/' + stand_in,
      }).then(function(response) {
          console.log("Get Success");
          response = response.data[0].description;
          if(response.substring(response.length-3, response.length) == "..."){
            response += (" " + familyMembers[0].gender);
            console.log(response);
          }
          var questString = additionalText + relativeInNeed + response;
          console.log(questString);
          questPrompt.event = questString;
          console.log(stand_in);
      }, function() {
          console.log("Get Error");
      });
      return promise;
    };

    var questPromptDescription = function() {
      console.log("stand_in", stand_in);
      var promise = $http({
          method: "GET",
          url: '/gameplay/secondevent/' + stand_in,
      }).then(function(response) {
          console.log("Get Success");
          questPrompt.description = response.data[0].description;
          console.log(questPrompt);
          eventHistory.push(questPrompt);
      }, function() {
          console.log("Get Error");
      });
      return promise;
    };

    //this is my number getter. The 'd' stand for Die or Dice

    var assignNumber = function(number) {
        familyNumber = undefined;
        console.log("Factory getnumber call running!");
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
            console.log(response);
            emotion = response.data[0].emotion;
        }, function() {
            console.log("Get Error");
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
        getEvent: function() {
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
        questPromptEvent: function() {
            return questPromptEvent();
        },
        questPromptDescription: function() {
            return questPromptDescription();
        }
        // grabQuest: function(){
        //   return questPrompt;
        // }
    };

}]);
