
var express = require('express');

var logger = require('connect-logger');

var app = express();

var fs = require('fs');
app.use(logger);

app.get('/', function(request, response) {
  console.log("TRACE1");
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  console.log(require('url').parse(request.url));
  response.send(fs.readFileSync('agile_inputs.html','utf8',function(err,data) {
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

app.get('/stil.css',function(request,response) { 
  console.log('requesting stil.css');
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  console.log(require('url').parse(request.url));
  response.send(fs.readFileSync('stil.css','utf8',function(err,data) {
    if(err) throw err;
    console.log(data);
  }));
});

app.get('/agile_funcs.js',function(request,response) { 
  console.log('requesting agile_funcs.js');
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  console.log(require('url').parse(request.url));
  response.send(fs.readFileSync('agile_funcs.js','utf8',function(err,data) {
    if(err) throw err;
    console.log(data);
  }));
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
