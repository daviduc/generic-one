
var express = require('express');

var logger = require('connect-logger');

var app = express();

var fs = require('fs');
var mongo = require('mongodb');
var mongo_client = mongo.MongoClient;
var regex_lib_js = /^\/lib.+\.js/;
var regex_js = /.+\.js/;
var regex_css = /.+\.css/;
var regex_html=/.+\.html/;
var regex_dijit_claro=/dijit.+claro\.css/;
var regex_claro=/claro\.css/;
var regex_dojo=/.+dojo\.js/;
var regex_appstates = /.+AppStates\.js/;
var regex_dojo_dijit=/.+dojo.+dijit\.js/;

app.use( function (request, response,next) {
    console.log(request.url);
    if (request.method == "GET" && regex_js.test(request.url)) {
	if(!regex_dojo.test(request.url) && !regex_appstates.test(request.url) && !regex_dojo_dijit.test(request.url)) {
	  response.writeHead(200,{'Content-Type': 'text/javascript','Content-Length':fs.statSync('.'+request.url).size});
          response.write(fs.readFileSync('.'+request.url,{encoding:'utf8'}));
	  response.end();
	}
    } else if (request.method == "GET" && regex_css.test(request.url)) {
        if(!regex_dijit_claro.test(request.url)) {
	    console.log(request.url + ' is ' + fs.statSync('.'+request.url).size); 
	    response.writeHead(200,{'Content-Type': 'text/css','Content-Length':fs.statSync('.'+request.url).size});
            response.write(fs.readFileSync('.'+request.url,{encoding:'utf8'}));
	    response.end();
	}
    } else if (request.method == "GET" && ( request.url == '/' || regex_html.test(request.url) )) {
	response.writeHead(200,{'Content-Type':'text/html','Content-Length':fs.statSync('kwyk1.html').size});
	response.write(fs.readFileSync('kwyk1.html',{encoding:'utf8'},function(err,data) {if(err) console.log(err);}));
	response.end();
    }
    console.log(request.url+' ending response');
   // if(!regex_dijit_claro.test(request.url) && !regex_dojo.test(request.url) && !regex_appstates.test(request.url) ) response.end();
    next();
});
app.get('/themes/dijit/themes/claro/claro.css',function(request,response) {
    response.writeHead(200,{'Content-Type': 'text/css','Content-Length':fs.statSync('.'+request.url).size});
    response.write(fs.readFileSync('.'+request.url,{encoding:'utf8'}));
    response.end();
});
app.get('/lib/dojo/dojo/dojo.js',function(request,response) {
    response.writeHead(200,{'Content-Type': 'text/javascript','Content-Length':fs.statSync('.'+request.url).size});
    response.write(fs.readFileSync('.'+request.url,{encoding:'utf8'}));
    response.end();
});
app.get('/lib/maqetta/AppStates.js',function(request,response) {
    response.writeHead(200,{'Content-Type': 'text/javascript','Content-Length':fs.statSync('.'+request.url).size});
    response.write(fs.readFileSync('.'+request.url,{encoding:'utf8'}));
    response.end();
});
app.get('/lib/dojo/dojo/resources/blank.gif',function(request,response) {
    response.writeHead(200,{'Content-Type': 'image/gif','Content-Length':fs.statSync('.'+request.url).size});
    response.write(fs.readFileSync('.'+request.url));
    response.end();
});
app.get('/lib/dojo/dijit/dijit.js',function(request,response) {
    response.writeHead(200,{'Content-Type': 'text/javascript','Content-Length':fs.statSync('.'+request.url).size});
    response.write(fs.readFileSync('.'+request.url,{encoding:'utf8'}));
    response.end();
});
app.get('/themes/dijit/themes/claro/layout/images/tabClose.png',function(request,response) {
    response.writeHead(200,{'Content-Type': 'image/png','Content-Length':fs.statSync('.'+request.url).size});
    response.write(fs.readFileSync('.'+request.url));
    response.end();
});
app.get('/db', function(request, response) {
  console.log("TRACE1");
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  console.log(require('url').parse(request.url));
  mongo_client.connect(process.env.MONGOHQ_URL, function(err, db) {
	  // operate on the collection named "test"
	  var collection = db.collection('test');
	 
	  // remove all records in collection (if any)
	  console.log('removing documents...');
	  collection.remove(function(err, result) {
	    if (err) {
	      return console.error(err);
	    }
	    console.log('collection cleared!');
	    // insert two documents
	    console.log('inserting new documents...');
	    collection.insert([{name: 'tester'}, {name: 'coder'}], function(err,
	docs) {
	      if (err) {
	        return console.error(err);
	      }
	      console.log('just inserted ', docs.length, ' new documents!');
	      collection.find({}).toArray(function(err, docs) {
	        if (err) {
	          return console.error(err);
	        }
	        docs.forEach(function(doc) {
	          console.log('found document: ', doc);
	        });
	      })
	    })
	  })
	});

});



var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
