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

  var stream = JSONStream.parse(['resultats',true,'lieuTravail',{emitKey: true}]);
  request(tokenRequestOptions, function (error, response, body) {
    if (error) throw new Error(error);
    var token = JSON.parse(body).access_token;

    request.get('https://api.emploi-store.fr/partenaire/offresdemploi/v2/offres/search', {
    'auth': {
      'bearer': token
    }
  }).pipe(stream).pipe(es.mapSync(function (data) {
    console.error(data)
    return data
  }))
  })
 
});


module.exports = router;
