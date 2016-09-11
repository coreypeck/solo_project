myApp.factory('FamilyFactory', ['$http', function($http) {
    console.log("family factory running");

    // Private
    //Setting necessary variables
    var familyNumber = undefined;
    var familyMembers = [];
    var eventObject = {
        "event": "",
        "description": ""
    };
    var eventHistory = [];
    var emotion = "";

    //this is my number getter. The 'd' stand for Die or Dice

    var assignNumber = function(number) {
        familyNumber = undefined;
        console.log("Factory getnumber call running!");
        var promise = $http({
            method: "GET",
            url: '/gameplay/d/' + number,
        }).then(function(response) {
            console.log("Get Success");
            console.log(parseInt(response.data));
            familyNumber = parseInt(response.data);
            console.log(familyNumber);
        }, function() {
            console.log("Get Error");
        });
        return promise;
    }

    //Grabs the number of Family members

    var numberOfMembers = function() {
        familyMembers = [];
        console.log("numberOfMembers Running");
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
        console.log("getEvent is running");
        var promise = $http({
            method: "GET",
            url: '/gameplay',
        }).then(function(response) {
            console.log("Get Success");
            eventObject = {
                "event": "",
                "description": ""
            };
            eventObject.event = response.data[0].description;
            console.log(eventObject.event);
        }, function() {
            console.log("Get Error");
        });
        return promise;
    }

    //Helps to further define the event

    var getDescription = function() {
        eventHistory = [];
        oneEvent = eventObject.event
        loweredEvent = oneEvent.toLowerCase();

        console.log('/gameplay/' + loweredEvent);
        var promise = $http({
            method: "GET",
            url: '/gameplay/' + loweredEvent,
        }).then(function(response) {

          //I wound up using standin variables because the .push()
          //wouldn't consistently read myeventObject correctly.
          //I believe I somehow created a second variable of eventObject
          //but I couldn't find it. So I went with this route!

            console.log("Get Success");
            eventObject.description = response.data[0].description;
            eventObject.event = oneEvent;
            var standin = eventObject;
            console.log(standin);
            eventHistory.push(standin);
        }, function() {
            console.log("Get Error");
        });
        return promise;
    }

    //Everyone needs emotions! It's a key part of Story telling!

    var getEmotion = function(){
      console.log("getEmotion is running");
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
        getDescription: function() {
            return getDescription();
        },
        getEmotion: function(){
            return getEmotion();
        },
        grabEmotion: function(){
          return emotion;
        }
    };

}]);
