var express = require('express');
var app = express();
var handlebars=require('express3-handlebars').create({defaultLayout:'main'});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

var fs = require('fs');
var routing=require('./routing.js')(app); //same as routing(app);

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
