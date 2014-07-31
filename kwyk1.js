


function onLoadProfile() {
    IN.Event.on(IN, "auth",onLinkedAuth);
};

function onLinkedAuth() {
    console.log("linkedin authorized");
    IN.API.Profile("me").fields("id","first-name","last-name","headline","industry").result(showProfile).error(errorProfiles);
    IN.API.Connections("me").fields("first-name", "last-name", "positions").params({"start":0,"count":500}).result(showConnections).error(errorConnections);
};


function showProfile(profiles) {
    member = profiles.values[0];
    $('<p id=\"' + member.id + '\">' + member.headline  + ' ' + member.industry +  '</p>').appendTo("#jobs_profile_data");
};

function errorProfiles(error) {
    console.log(error);
};

function showConnections(connections) {
    var positions = new Array();
    //IN.API.Profile("me").fields("last-name","first-name","positions").result(function(profile) { console.log(profile.values[0].positions.values[0].title); })
    connections.values.forEach(function(conn) {
	if(typeof conn.positions != 'undefined') {
    	    positions =typeof conn.positions.values != 'undefined' ? conn.positions.values: 0;
	    if(positions != 0) {
		$('<p>'+conn.firstName + ' ' + conn.lastName + ' ' + '</p>').appendTo("#sales");
		positions.forEach(function(pos) { 
		    end=typeof pos.endDate != 'undefined' ? pos.endDate.month+"/"+pos.endDate.year : "present";
		    start=typeof pos.startDate != 'undefined' ? pos.startDate.month+"/"+pos.startDate.year: "unknown";
		    $('<p id=p2nd>'+pos.company.name+' : '+ pos.title+ ' : ' + start + " to " + end+ '</p>').appendTo("#sales");
		});
		$('<br>').appendTo("#sales");
	    }
	}
    });
};

function errorConnections(error) {
    console.log(error);
};
