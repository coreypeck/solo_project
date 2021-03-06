var express = require("express");
var router = express.Router();
var rn = require("./randomnumber.js");
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/solo_project';
router.get('/', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        randomNumber = rn.randomnumber8();
        console.log(randomNumber);
        client.query("SELECT * FROM events WHERE events.id = " + randomNumber,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                // console.log('results: ', resultStuff);

                res.send(result.rows);
            });

    });
});

//Gets the size of the town (Essentially, the number of buildings)

router.post('/town', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        randomNumber = rn.randomnumber4();
        console.log(randomNumber);
        client.query("SELECT * FROM town_size WHERE town_size.id = " + randomNumber,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });

    });
});

//Grabs my town buildings!

router.post('/buildings', function(req, res) {
    console.log("Ajax request at buildings");
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        randomNumber = rn.randomnumber20();
        console.log(randomNumber);
        client.query("SELECT * FROM town_buildings WHERE town_buildings.id = " + randomNumber,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });

    });
});

router.post('/guilds', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        randomNumber = rn.randomnumber6();
        console.log(randomNumber);
        client.query("SELECT * FROM guilds WHERE guilds.id = " + randomNumber,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });
    });
});

//think as in: Family Member

router.post('/members', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        randomNumber = rn.randomnumber4();
        console.log(randomNumber);
        client.query("SELECT * FROM family_members WHERE family_members.id = " + randomNumber,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });

    });
});

//This is where emotions come from

router.post('/emotions', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        randomNumber = rn.randomnumber100();
        console.log(randomNumber);
        client.query("SELECT * FROM emotions WHERE emotions.id = " + randomNumber,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });

    });
});

router.post('/insults', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        randomNumber = rn.randomnumberunknown(34);
        console.log(randomNumber);
        client.query("SELECT * FROM insults WHERE insults.id = " + randomNumber,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });
    });
});

router.post('/fight_success/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var number = req.params.id.substring(req.params.id.length - 2, req.params.id.length - 1);
        var idNumber = req.params.id.substring(req.params.id.length - 1, req.params.id.length);
        console.log(number);
        console.log(idNumber);
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        console.log("SELECT * FROM wants_to_fight_action_" + number + "_success WHERE wants_to_fight_action_" + number + "_success.id = " + idNumber);
        var standin = "SELECT * FROM wants_to_fight_action_" + number + "_success WHERE wants_to_fight_action_" + number + "_success.id = " + idNumber;
        client.query(standin,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });
    });
});

router.post('/success/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var eventNumber = req.params.id.substring(req.params.id.length - 1, req.params.id.length);
        var tableNumber = req.params.id.substring(req.params.id.length - 3, req.params.id.length - 2);
        console.log("eventNumber", eventNumber);
        console.log("tableNumber", tableNumber);

        var id = req.params.id.substring(0, req.params.id.length - 4);
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        if (id == "illness" || id == "lost" || id == "robbed") {
          tableNumber = '1';
        } else {
            randomNumber = eventNumber * 2;
        }
        var chanceNumber = rn.coin();
        chanceNumber = parseInt(chanceNumber);
        randomNumber -= chanceNumber;
        console.log("tableNumber", tableNumber);
        console.log("randomNumber", randomNumber);
        console.log("chanceNumber", chanceNumber);

        if(id + "_action_" + tableNumber + "_success" == "kidnapped_action_2_success"){
          randomNumber = (randomNumber % 2) + 1;
        }

        console.log("SELECT * FROM " + id + "_action_" + tableNumber + "_success WHERE " + id + "_action_" + tableNumber + "_success.id = " + randomNumber);
        var standin = "SELECT * FROM " + id + "_action_" + tableNumber + "_success WHERE " + id + "_action_" + tableNumber + "_success.id = " + randomNumber;
        client.query(standin,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });
    });
});

router.post('/action/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
      var eventNumber = req.params.id.substring(req.params.id.length - 1, req.params.id.length);
      var tableNumber = req.params.id.substring(req.params.id.length - 3, req.params.id.length - 2);
      var id = req.params.id.substring(req.params.id, req.params.id.length - 4);
        console.log(eventNumber);
        console.log(tableNumber);
        console.log(id);

        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        if (id == "illness" || id == "lost" || id == "robbed") {
                tableNumber = '1';
        }
        randomNumber = rn.randomnumber4();
        console.log(randomNumber);
        console.log("SELECT * FROM " + id + "_action_" + tableNumber + " WHERE " + id + "_action_" + tableNumber + ".id = " + randomNumber)
        client.query("SELECT * FROM " + id + "_action_" + tableNumber + " WHERE " + id + "_action_" + tableNumber + ".id = " + randomNumber,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });

    });
});

router.post('/wando/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var lessTen = req.params.id.substring(req.params.id.length - 1, req.params.id.length);
        var isTen = req.params.id.substring(req.params.id.length - 2, req.params.id.length);
        console.log(lessTen);
        console.log(isTen);
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        if (isTen == 10) {
            console.log("Number is 5");
            number = isTen;
        } else {
            number = lessTen;
        }
        console.log(randomNumber);
        console.log("SELECT * FROM wando_actions WHERE wando_actions.id = " + number)
        client.query("SELECT * FROM wando_actions WHERE wando_actions.id = " + number,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });

    });
});

//d for Dice!

router.post('/d/:id', function(req, res) {
    var id = req.params.id;
    var randomNumber = 0;
    var unknownCheck = id.substring(0, 7);
    console.log(unknownCheck);
    if (unknownCheck == "unknown") {
        var unknownNumber = id.substring(7, 8);
        console.log("unknownNumber:", unknownNumber);

        //This is my call for a random number. The others act like dice,
        //but this will get you a number from one to...whatever you requested
        unknownNumber = parseInt(unknownNumber);
        randomNumber = rn.randomnumberunknown(unknownNumber);
        console.log(randomNumber);
    } else {
        console.log("/d/:id = ", id);
        var randomNumber = 0;
        switch (id) {
            case 'four':
                randomNumber = rn.randomnumber4();
                break;
            case 'six':
                randomNumber = rn.randomnumber6();
                break;
            case 'eight':
                randomNumber = rn.randomnumber8();
                break;
            case 'ten':
                randomNumber = rn.randomnumber10();
                break;
            case 'twenty':
                randomNumber = rn.randomnumber20();
                break;
            case 'hundred':
                randomNumber = rn.randomnumber100();
                break;
            default:
                randomNumber = rn.randomnumber4();
        }
    }
    res.send(randomNumber.toString());
});

router.post('/firstevent/:id', function(req, res) {
    var id = req.params.id;
    console.log("first event id: ", id);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        switch (id) {
            case "illness":
                id = 1;
                break;
            case "lost":
                id = 2;
                break;
            case 'kidnapped':
                id = 3;
                break;
            case 'financial_issues':
                id = 4;
                break;
            case 'murdered':
                id = 5;
                break;
            case 'robbed':
                id = 6;
                break;
            case 'in_love':
                id = 7;
                break;
            case 'wants_to_fight':
                id = 8;
                break;
            default:
                id = 5;
        }
        console.log(id);
        client.query("SELECT * FROM quest_factor_text WHERE quest_factor_text.id = " + id,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });

    });
});

router.post('/secondevent/:id', function(req, res) {
    var id = req.params.id;
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        randomNumber = rn.randomnumber4();
        console.log("Second Event Random Number: ", randomNumber);
        console.log("Second Event Id:", id)
        client.query("SELECT * FROM " + id + "_factor WHERE " + id + "_factor.id = " + randomNumber,
            function(err, result) {
                done();
                console.log("Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                res.send(result.rows);
            });
    });
});
module.exports = router;
