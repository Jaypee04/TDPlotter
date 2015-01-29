var port = 1210;
var express = require('express');
var app = express();
var body_parser = require('body-parser');
app.use(body_parser());


app.get("/", function(req, res) {
    res.sendfile('TDPlotter.html')
});

/* //Get value from app
app.post("/user/add", function(req, res) { 
    // some server side logic
	var locValue = {
		locateValue: req.body.longi + ' ' + req.body.lati 
		
	};
	res.json(locValue);
	
	
 }); 
 */
	
app.use(express.static(__dirname));


var server = app.listen(port, function(){
	console.log('Listening on port %d', port);
});