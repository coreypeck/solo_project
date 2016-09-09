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
            tableName = "murderer";
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
