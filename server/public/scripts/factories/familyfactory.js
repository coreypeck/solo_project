myApp.factory('FamilyFactory', ['$http', function($http) {
    console.log("family factory running");

    // Private
    var familyNumber = undefined;
    var familyMembers = [];



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


    var numberOfMembers = function() {
      familyMembers = [];
        console.log("numberOfMembers Running");
        for (var i = 0; i < familyNumber; i++) {
            var promise = $http({
                method: "GET",
                url: '/gameplay/members',
            }).then(function(response) {
                console.log("getFamilyMembers Get Success");
                familyMembers.push(response.data[0].description);
            }, function() {
                console.log("Get Error");
            });
        }
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
        }
    };

}]);
