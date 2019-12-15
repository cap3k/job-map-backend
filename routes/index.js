var express = require('express');
var router = express.Router();
var request = require("request")
  , JSONStream = require('JSONStream')
  , es = require('event-stream')

var dotenv = require('dotenv');
var fs = require('fs');


dotenv.config();



/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("new request")
  res.header("Access-Control-Allow-Origin", "*");
  var tokenRequestOptions = {
    method: 'POST',
    url: process.env.POLE_EMPLOI_URL_TOKEN,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.POLE_EMPLOI_CLIENT_ID,
      client_secret: process.env.POLE_EMPLOI_CLIENT_SECRET,
      scope: process.env.POLE_EMPLOI_SCOPE
    }
  };
  var index = 0;
  var stream = JSONStream.parse(['resultats', true, 'lieuTravail']);
  stream.on('data', function (data) {
    if (data.longitude && data.latitude) {
      var lngLat = [];
      lngLat.push(data.longitude)
      lngLat.push(data.latitude)
      var pos = { COORDINATES: lngLat };
      res.write(((index === 0) ? '[' : ',') + JSON.stringify(pos));
      index++
    }
  });
  stream.on('end', function () {
    console.log("ending response")
    res.write(']');
    res.end();
  });

  request(tokenRequestOptions, function (error, response, body) {
    if (error) throw new Error(error);
    var token = JSON.parse(body).access_token;

    request.get('https://api.emploi-store.fr/partenaire/offresdemploi/v2/offres/search', {
      'auth': {
        'bearer': token
      }
    }).pipe(stream)
  })

});


module.exports = router;
