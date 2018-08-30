var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();
var privateKey = fs.readFileSync('client-key.pem').toString();
var certificate = fs.readFileSync('client-cert.pem').toString();
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(4443);
app.get('/', function (req, res) {
// run some server-side code
console.log(‘the server has received a request’);
res.send(‘Hello World’);
});