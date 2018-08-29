//Import the required connectivity code and set up a database connection
var pg = require('pg');
var pool = new pg.Pool(config);

app.get('ADD CONNECTION', function (req,res) {
pool.connect(function(err,client,done) {
if(err){
console.log("not able to get connection "+ err);
res.status(400).send(err);
}


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
