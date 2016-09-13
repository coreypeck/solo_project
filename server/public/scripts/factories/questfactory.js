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
