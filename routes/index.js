var express = require('express');
var router = express.Router();
var request = require("request");
var dotenv = require('dotenv');

dotenv.config();

/* GET home page. */
router.get('/', function (req, res, next) {

  var options = {
    method: 'POST',
    url: process.env.POLE_EMPLOI_URL_TOKEN,
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    form: {
      grant_type: 'client_credentials',
      client_id: process.env.POLE_EMPLOI_CLIENT_ID,
      client_secret: process.env.POLE_EMPLOI_CLIENT_SECRET,
      scope: process.env.POLE_EMPLOI_SCOPE
    }
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body);
  });

});

module.exports = router;
