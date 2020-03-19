var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var path = require('path');
var fs = require('fs');
var http = require('http');
var https = require('https');


var router = require('./api/routes/routes');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "POST GET");
    res.header("Access-Control-Allow-Headers", "Content-Type, Origin, Authorization, Accept");
    next();
});

app.use('/', router);

//var privateKey  = fs.readFileSync('private/key.pem', 'utf8');
//var certificate = fs.readFileSync('private/cert.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
//var httpsServer = https.createServer(credentials, app);
//httpsServer.listen(443);

var httpServer = http.createServer(app);
httpServer.listen(port);