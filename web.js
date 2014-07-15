var express = require('express');

var logger = require('morgan');

var app = express(logger);

var fs = require('fs');

app.get('/', function(request, response) {
  response.send(fs.readFileSync('agile_inputs.html','utf8',function(err,data) {
    if(err) throw err;
    console.log(data);
  }));
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
