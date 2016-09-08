var express = require("express");
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';
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
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }

    client.query("SELECT * FROM favoritepets",
      function(err, result) {
        done();

        if(err) {
          console.log("select error: ", err);
          res.sendStatus(500);
        }
        // console.log('results: ', resultStuff);

        res.send(result.rows);
    });

  });
});
router.delete('/:id', function(req, res) {
  var petID = req.params.id;
  console.log(petID);
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }

  client.query("DELETE FROM favoritepets WHERE petid=$1",
      [petID],
      function(err, result) {
        done();

        if(err) {
          console.log("delete error: ", err);
          res.sendStatus(500);
        }

        res.sendStatus(202);
    });
  });

});
module.exports = router;
