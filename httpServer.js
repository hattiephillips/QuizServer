// express is the server that forms part of the nodejs program
var express = require('express');
var path = require('path');
var app = express();

//Add the body-parser to httpServer.js so that you will be able to process the uploaded data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
extended: true
}));
app.use(bodyParser.json());
	// adding functionality to allow cross-domain queries when PhoneGap is running a server
	app.use(function(req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
		res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		next();
	});


app.post('/uploadAnswer',function(req,res){
	console.dir(req.body);
	pool.connect(function(err,client,done){
		res.status(400).send(err);
	}
	var querystring="INSERT into answers (question,answer,correct) values ('";
	querystring=querystring +req.body.question + "','" +req.body.answer + "','" +req.body.correct + "','" )";
	console.log(querystring);
	client.query(querystring,function(err,result) {
		done();
		console.log(err);
		res.status(400).send(err);
	}
	res.status(200).send("row insrted");
});


//log requests
app.use(function (req,res,next) {
	var filename =path.basename(req.url);
	var extension=path.extname(filename);
	console.log("The file" + filename + "Was requested");
	next ();
});
//http server to the serve files otherwise it will result in error
var http=require ('http');
var httpServer=http.createServer(app);
httpServer.listen(4480);
app.get('/',function (req,res) {
	res.send("Hello World");
});

var fs=require('fs')
// read in the file and force it to be a string by adding “” at the beginning
// read in the file and force it to be a string by adding “” at the beginning
var configtext =
""+fs.readFileSync("/home/studentuser/certs/postGISConnection.js");
// now convert the configruation file into the correct format -i.e. a name/value
pair array
var configarray = configtext.split(",");
var config = {};
for (var i = 0; i < configarray.length; i++) {
var split = configarray[i].split(':');
config[split[0].trim()] = split[1].trim();
}

//Import the required connectivity code and set up a database connection
var pg = require('pg');
var pool = new pg.Pool(config);

app.get('/getGeoJSON/:tablename/:geomcolumn', function (req,res) {
pool.connect(function(err,client,done) {
if(err){
console.log("not able to get connection "+ err);
res.status(400).send(err);
}
var colnames = "";
// first get a list of the columns that are in the table
// use string_agg to generate a comma separated list that can then be pasted into the next query
var querystring = "select string_agg(colname,',') from ( select column_name as colname ";
querystring = querystring + " FROM information_schema.columns as colname ";
querystring = querystring + " where table_name = '"+ req.params.tablename +"'";
querystring = querystring + " and column_name <>'"+req.params.geomcolumn+"') as cols ";
console.log(querystring);
// now run the query
client.query(querystring,function(err,result){
//call `done()` to release the client back to the pool
console.log("trying");
done();
if(err){
console.log(err);
res.status(400).send(err);
}
// for (var i =0; i< result.rows.length ;i++) {
// console.log(result.rows[i].string_agg);
// }
thecolnames = result.rows[0].string_agg;
colnames = thecolnames;
console.log("the colnames "+thecolnames);
// now use the inbuilt geoJSON functionality
// and create the required geoJSON format using a query adapted from here:
// http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4thJanuary 2018
// note that query needs to be a single string with no line breaks sobuilt it up bit by bit
var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ";
querystring = querystring + "(SELECT 'Feature' As type , ST_AsGeoJSON(lg." + req.params.geomcolumn+")::json As geometry, ";
querystring = querystring + "row_to_json((SELECT l FROM (SELECT "+colnames + ") As l )) As properties";
querystring = querystring + " FROM "+req.params.tablename+" As lg limit 100 ) As f ";
console.log(querystring);
// run the second query
client.query(querystring,function(err,result){
//call `done()` to release the client back to the pool
done();
if(err){
console.log(err);
res.status(400).send(err);
}
res.status(200).send(result.rows);
});
});
});
});

app.get('/:name1',function (req, res) {
	console.log('request' +req.params.name1);
	res.sendFile(_dirname + '/' +req.params.name1);
});
app.get('/:name1/:name2',function (req, res) {
	console.log('request' +req.params.name1 + "/" + req.params.name2);
	res.sendFile(_dirname + '/' +req.params.name1 + "/" + req.params.name2);
});
app.get('/:name1/:name2/:name3',function (req, res) {
	console.log('request' +req.params.name1 + "/" + req.params.name2 + "/" + req.params.name3);
	res.sendFile(_dirname + '/' +req.params.name1 + "/" + req.params.name2 + "/" + req.params.name3);
});
app.get('/:name1/:name2/:name3/:name4',function (req, res) {
	console.log('request' +req.params.name1 + "/" + req.params.name2 + "/" + req.params.name3 + "/" + req.params.name4);
	res.sendFile(_dirname + '/' +req.params.name1 + "/" + req.params.name2 + "/" + req.params.name3 + "/" + req.params.name4);
});