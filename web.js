
var express = require('express');

var logger = require('connect-logger');

var app = express();

var fs = require('fs');

var mongo = require('mongodb');
var mongo_client = mongo.MongoClient;

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
	})


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
