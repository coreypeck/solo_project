var express = require("express");
var router = express.Router();
var rn = require("./randomnumber.js");
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/solo_project';
router.post('/', function(req, res) {
    var pet = req.body;
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('INSERT INTO favoritepets (petid, petname, petimg, petdescription) ' +
            'VALUES ($1, $2, $3, $4)', [pet.id, pet.name, pet.photo, pet.description],
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
    });
});
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
router.get('/emotion', function(req, res) {
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
router.get('/d/:id', function(req, res) {
  console.log("/d/:id");
    var id = req.params.id;
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
    res.send(randomNumber.toString());
});
router.get('/:id', function(req, res) {
    var id = req.params.id;
    console.log("the Id", id);
    var tableName = "";
    switch (id) {
        case "illness":
        case "lost":
            tableName = "difficulty";
            break;
        case "kidnapped":
            tableName = "kidnapper";
            break;
        case "financial_issues":
            tableName = "financial_issues";
            break;
        case "murdered":
            tableName = "murdered";
            break;
        case "robbed":
            tableName = "robbed";
            break;
        case "in_love":
            tableName = "relationship";
            break;
        case "wants_to_fight":
            tableName = "wants_to_fight";
            break;
        default:
            tableName = "murdered";
    };
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        randomNumber = rn.randomnumber4();
        console.log("Table Id number: ", randomNumber);
        client.query("SELECT * FROM " + tableName + " WHERE " + tableName + ".id = " + randomNumber,
            function(err, result) {
                done();
                console.log("Event Modifier Result", result);
                if (err) {
                    console.log("select error: ", err);
                    res.sendStatus(500);
                }
                // console.log('results: ', resultStuff);

                res.send(result.rows);
            });

    });
});
module.exports = router;
