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

router.get('/town', function(req, res) {
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

router.get('/buildings', function(req, res) {
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

router.get('/guilds', function(req, res) {
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

router.get('/members', function(req, res) {
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

router.get('/emotions', function(req, res) {
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

router.get('/insults', function(req, res) {
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

router.get('/fight_success/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var number = req.params.id.substring(req.params.id.length-2, req.params.id.length-1);
        var idNumber = req.params.id.substring(req.params.id.length-1, req.params.id.length);
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

router.get('/success/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var number = req.params.id.substring(req.params.id.length - 1, req.params.id.length);
        var id = req.params.id.substring(0, req.params.id.length - 2);
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        if (number == 5) {
            console.log("Number is 5");
            number = '1';
            randomNumber = 1;
        } else {
            randomNumber = number;
        }
        var chanceNumber = rn.coin();
        chanceNumber = parseInt(chanceNumber) + 1;
        console.log("SELECT * FROM " + id + "_action_" + number + "_success WHERE " + id + "_action_" + number + "_success.id = " + randomNumber);
        var standin = "SELECT * FROM " + id + "_action_" + number + "_success WHERE " + id + "_action_" + number + "_success.id = " + randomNumber;
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

router.get('/action/:id', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var number = req.params.id.substring(req.params.id.length - 1, req.params.id.length);
        var id = req.params.id.substring(0, req.params.id.length - 2);
        console.log(number);
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        if (number == 5) {
            console.log("Number is 5");
            number = '1';
            randomNumber = '1';
        } else {
            randomNumber = number;
        }
        console.log(randomNumber);
        console.log("SELECT * FROM " + id + "_action_" + number + " WHERE " + id + "_action_" + number + ".id = " + randomNumber)
        client.query("SELECT * FROM " + id + "_action_" + number + " WHERE " + id + "_action_" + number + ".id = " + randomNumber,
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

router.get('/d/:id', function(req, res) {
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

router.get('/firstevent/:id', function(req, res) {
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

router.get('/secondevent/:id', function(req, res) {
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
