
var express = require('express');

var logger = require('connect-logger');

var app = express();

var fs = require('fs');

var mongo = require('mongodb');
var mongo_client = mongo.MongoClient;

app.use( function (request, response,next) {
    regex_lib_js = /^\/lib.+\.js/;
    regex_js = /.+\.js/;
    regex_css = /.+\.css/;
    console.log(request.url);
    if (request.method == "GET" & regex_lib_js.test(request.url)) {
        response.writeHead(200, { 'Content-Type': 'text/javascript' });
        response.write(fs.readFileSync('.' + request.url, 'utf8'));
        response.end();    
    }
    if (request.method == "GET" & regex_css.test(request.url)) {
        response.writeHead(200, { 'Content-Type': 'text/css' });
        response.write(fs.readFileSync('.' + request.url, 'utf8'));
        response.end();
    }
    if (request.method == "GET" & regex_js.test(request.url)) {
        response.writeHead(200, { 'Content-Type': 'text/javascript' });
        response.write(fs.readFileSync('.' + request.url, 'utf8'));
        response.end();
    }
    next();
});

app.get('/', function(request, response) {
  console.log("TRACE1");
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  console.log(require('url').parse(request.url));
  mongo_client.connect(process.env.MONGOHQ_URL, function(err, db) {
	  // operate on the collection named "test"
	  var collection = db.collection('test')
	 
	  // remove all records in collection (if any)
	  console.log('removing documents...')
	  collection.remove(function(err, result) {
	    if (err) {
	      return console.error(err)
	    }
	    console.log('collection cleared!')
	    // insert two documents
	    console.log('inserting new documents...')
	    collection.insert([{name: 'tester'}, {name: 'coder'}], function(err,
	docs) {
	      if (err) {
	        return console.error(err)
	      }
	      console.log('just inserted ', docs.length, ' new documents!')
	      collection.find({}).toArray(function(err, docs) {
	        if (err) {
	          return console.error(err)
	        }
	        docs.forEach(function(doc) {
	          console.log('found document: ', doc)
	        })
	      })
	    })
	  })
	  response.send(fs.readFileSync('kwyk1.html','utf8',function(err,data) {
		    if(err) throw err;
		    console.log(data);
	  }));
	})

});






var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
