//. app.js

var express = require( 'express' ),
    cfenv = require( 'cfenv' ),
    bodyParser = require( 'body-parser' ),
    fs = require( 'fs' ),
    watson_pi_v3 = require( 'watson-developer-cloud/personality-insights/v3' ),
    app = express();
var settings = require( './settings' );
var appEnv = cfenv.getAppEnv();
var pi = new watson_pi_v3({
  username: settings.pi_username,
  password: settings.pi_password,
  version_date: '2016-10-20'
});

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( express.Router() );
app.use( express.static( __dirname + '/public' ) );

app.post( '/postpi', function( req, res ){
  var text = req.body.text;
  
  var pi_params = {
    text: text,
    consumption_preferences: true,
    raw_scores: true,
    headers: {
      'accept-language': 'ja',
      'content-language': 'ja',
      'accept': 'application/json'
    }
  };
  pi.profile( pi_params, function( error, response ){
    var result = {};
    if( error ){
      result = { error: error };
    }else{
      result = { result: response };
    }

    res.write( JSON.stringify( result ) );
    res.end();
  });
});

app.listen( appEnv.port );
console.log( "server stating on " + appEnv.port + " ..." );

