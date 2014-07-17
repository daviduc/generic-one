
var express = require('express');

var logger = require('connect-logger');

var app = express();

var fs = require('fs');


app.get('/', function(request, response) {
  console.log("TRACE1");
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  console.log(require('url').parse(request.url));
  response.send(fs.readFileSync('kwyk1.html','utf8',function(err,data) {
    if(err) throw err;
    console.log(data);
  }));
});

app.get('/agile_inputs.html', function(request,response) {
  console.log("TRACE2");
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  console.log(require('url').parse(request.url));
  response.send(fs.readFileSync('agile_inputs.html','utf8',function(err,data) {
    if(err) throw err;
    console.log(data);
  }));
});

app.get('/kwyk1.css',function(request,response) { 
  console.log('requesting kwyk1.css');
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  console.log(require('url').parse(request.url));
  response.writeHead(200, {'Content-Type':'text/css'});
  response.write(fs.readFileSync('kwyk1.css','utf8'));
  response.end();

});

app.get('/kwyk1.js',function(request,response) { 
  console.log('requesting kwyk1.js');
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  console.log(require('url').parse(request.url));
  response.writeHead(200,{'Content-Type':'text/javascript'});
  response.write(fs.readFileSync('kwyk1.js','utf8'));
  response.end();
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
