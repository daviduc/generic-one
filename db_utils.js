var mongo = require('mongodb');                                                                                                                                                                         
var mongo_client = mongo.MongoClient; 

function test_mongo() {
    mongo_client.connect(process.env.MONGOHQ_URL, function(err, db) {
	// operate on the collection named "test"                                                                                                                                                             
	var collection = db.collection('kwyk1.accounts');
	// remove all records in collection (if any)                                                                                                                                                          
	db.collectionNames(function(err,names) {console.log(names); });
	console.log('removing documents...');
	collection.remove(function(err, result) {
	    if (err) {return console.error(err);};
	    console.log('collection cleared!');
	    // insert two documents                                                                                                                                                                           
	    console.log('inserting new documents...');
	    collection.insert([{name: 'tester'}, {name: 'coder'}], function(err,docs) {
		if (err) {return console.error(err);};
		console.log('just inserted ', docs.length, ' new documents!');
		collection.find({}).toArray(function(err, docs) {
		    if (err) {return console.error(err);};
		    docs.forEach(function(doc) {console.log('found document: ', doc);});
		});
	    });
	});
    });
};

function create_routes() {
    mongo_client.connect(process.env.MONGOHQ_URL,function(err,db) {
	var routes_collection=db.collection('kwyk1.routes');
    });
};

exports.test_mongo=test_mongo;
