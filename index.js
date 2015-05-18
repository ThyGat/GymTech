
// UserDetails API demo - Node JS sample app
// (c) 2015 Orange - All rights reserved.

var express = require('express');
var urlParser = require('url');
var https = require('https');

var HOME = "https://gymtech.herokuapp.com";
var CLIENT_ID = 'tXBelIi9Am2I2f1nbvAC59GAwPTEGuX5';
var CLIENT_SECRET = 'fHVcTgwP8f06V65E';
var REDIRECT_URI = 'https://gymtech.herokuapp.com/identity';
var REDIRECT_URI_ENCODED = 'https%3A%2F%2Fgymtech.herokuapp.com%2Fidentity';

function createMainPage (req, res) {

        var url = "https://api.orange.com/oauth/v2/authorize?";
        url += "scope=openid%20profile%20address%20phone%20email";
        url += "&response_type=code";
        url += "&client_id="+CLIENT_ID;
        url += "&prompt=login%20consent";
        url += "&state=UserDetailsDemo";
        url += "&redirect_uri="+REDIRECT_URI_ENCODED;
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        var result = "<!DOCTYPE html><html><title>GymTech</title>";
        result += "<style>";
        result += "h1, h2, a, p, td { color: navy; font-family: sans-serif; padding: 20px; }";
        result += "td { font-size: 40px; vertical-align: middle; }";
        result += "body { margin: 0 }";
        result += "</style>";
        result += '<body>';
        result += '<img src="Gym.jpg" width=100%>';
        result += '<table><tr>';
        result += '<td><img src="GymTech-logo.png" width=80px></td>';
        result += '<td>GymTech</td>';
        result += '</tr></table>';
        result += '<p>Sign in using your account with:</p>';
        result += '<p><img src="OTT-monochrome-logos.png">&nbsp;';
        result += '<a href="'+url+'"><img src="Orange-logo.png"></a>';
		result += '</p>';
        result += '</body></html>';
        res.send(result);
}

function createErrorPage (res, msg) {

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        var result = "<!DOCTYPE html><html><title>GymTech</title>";
        result += "<style>";
        result += "h1, h2, a, p, td { color: navy; font-family: sans-serif; padding: 20px; }";
        result += "td { font-size: 40px; vertical-align: middle; }";
        result += "body { margin: 0 }";
        result += "</style>";
        result += '<body>';
        result += '<h1>GymTech connection</h1>';
        result += '<p>An unexpected error occured ('+msg+')</p>';
        result += '<p><a href="'+HOME+'"><img src="restart.png"></a></p>';
        result += '</body></html>';
        res.send(result);
}
    
function createDetailsPage (res, user) {

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        var result = "<!DOCTYPE html><html><title>GymTech</title>";
        result += "<style>";
        result += "h1, h2, a, p, td { color: navy; font-family: sans-serif; padding: 10px; }";
        result += "td { font-size: 40px; vertical-align: middle; }";
        result += "td.p { color: gray; font-size: 20px; text-align:right}";
        result += "td.v { color: black; font-size: 22px; text-align:left; background-color:WhiteSmoke }";
        result += "body { margin: 0 }";
        result += "</style>";
        result += "<body>";
        result += '<table><tr>';
        result += '<td><img src="GymTech-logo.png" width=80px></td>';
        result += '<td>GymTech</td>';
        result += '</tr></table>';
        result += '<h1>Subscription form</h1>';
        result += '<table>';
        for (prop in user) {
	         result += '<tr><td class="p">'+prop+'</td><td class="v">'+user[prop]+'</td></tr>'
        }
        result += '</table>';
        result += '<p><a href="'+HOME+'"><img src="restart.png"></a></p>';
        result += '</body></html>';
        res.send(result);
}

function getToken (res, code) {

        var credentials = "Basic "+new Buffer(CLIENT_ID+":"+CLIENT_SECRET).toString('base64');
        var postData = "";
        postData += "grant_type=authorization_code";
        postData += "&code="+code;
        postData += "&redirect_uri="+REDIRECT_URI;
        try {
            var options = {
                    host: 'api.orange.com',
                    path: '/oauth/v2/token'
            };
            options['method'] = 'POST';
            options['headers'] = {
                'Authorization': credentials,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            };
            var req = https.request (options, function(response) {
                response.setEncoding('utf8');
                var responseData = '';
                response.on ('data', function(data) {
                    responseData += data;
                });
                response.on ('end', function() {
                    var result = JSON.parse (responseData);
                    console.log ("get access token + "+result.access_token);
                    getUserData (res, result.access_token);
                });
            }).on('error', function(e) {
                console.log("getToken : Got error: " + e.message);
                createErrorPage (res, e.message);
            });

            req.write(postData);
            req.end();
        } catch (e) {
            console.log ("exception during getToken: "+e);
            createErrorPage (res, e);
        }
}
    
function getUserData (res, accessToken) {

        var credentials =  "Bearer "+accessToken;
        try {
            var options = {
                    host: 'api.orange.com',
                    path: '/openidconnect/v1/userinfo'
                };
            options['headers'] = {
                'Authorization': credentials,
            };            
            var req = https.get (options, function(response) {
                response.setEncoding('utf8');
                var responseData = '';
                response.on ('data', function(data) {
                    responseData += data;
                });
                response.on ('end', function() {
                    var user = JSON.parse (responseData);
                    createDetailsPage (res, user);
                    console.log ("get user data + "+JSON.stringify(user));
                });
            }).on('error', function(e) {
                console.log("getUserData : Got error: " + e.message);
                createErrorPage (res, e.message);
            });
        } catch (e) {
            console.log ("exception during getUserData: "+e);
            createErrorPage (res, e);
        }
}

function identity (req, res) {

        var queryObject = urlParser.parse(req.url, true).query;
        getToken (res, queryObject.code);
}
    
var app = express();
    
app.set('port', (process.env.PORT || 5000)); // cannot force 80
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) { createMainPage(request, response); });
app.get('/identity', function(request, response) { identity(request, response); });

app.listen(app.get('port'), function() {
  console.log('userDetails Node app is running on port', app.get('port'));
});
