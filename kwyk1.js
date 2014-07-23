
(function ($) {
    $.fn.html5jTabs = function (options) {
        return this.each(function (index, value) {
            var obj = $(this), objFirst = obj.eq(index), objNotFirst = obj.not(objFirst);
            $("#" + objNotFirst.attr("data-toggle")).hide();
            $(this).eq(index).addClass("active");
            obj.click(function (evt) {
                var re = new RegExp(obj.attr("data-toggle"));
                var arr_toggler = new Array();
                $('[id]').each(function ()
                {
                    if (re.test($(this).attr("id"))) arr_toggler.push($(this).attr("id")); /*add id to array*/
                });
                
                toggler = "#" + obj.attr("data-toggle");
                togglerRest = $(toggler).parent().find("div");
                togglerRest.hide();
                //turn off all tab names
                $(this).parent("div").find("a").removeClass("active");
                //turn on only the active tab
                $(this).addClass("active");
                arr_toggler.forEach(function (id_name) {
                    toggler = "#" + id_name;
                    $(toggler).show();
                });
                return false;
            });
        });
    };
} (jQuery));

function onLoadProfile() {
    IN.Event.on(IN, "auth",onLinkedAuth);
};

function onLinkedAuth() {
    console.log("linkedin authorized");
    IN.API.Profile("me").fields("id","first-name","last-name","headline","industry").result(showProfile).error(errorProfiles);
    IN.API.Connections("me").fields("first-name", "last-name", "positions").result(showConnections).error(errorConnections);
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
    	positions = typeof conn.positions.values != 'undefined' ? conn.positions.values: 0;
	    if(positions != 0) {
	    	$('<p>'+conn.firstName + ' ' + conn.lastName + ' ' + '</p>').appendTo("#sales");
	    	positions.forEach(function(pos) { 
	    		end=typeof pos.endDate != 'undefined' ? pos.endDate.month+"/"+pos.endDate.year : "present";
	    		start=typeof pos.startDate != 'undefined' ? pos.startDate.month+"/"+pos.startDate.year: "unknown";
	    		$('<p id=p2nd>'+pos.company.name+' : '+ pos.title+ ' : ' + start + " to " + end+ '</p>').appendTo("#sales");
	    	})
	    	$('<br>').appendTo("#sales");
	    }
    });
};

function errorConnections(error) {
    console.log(error);
};
