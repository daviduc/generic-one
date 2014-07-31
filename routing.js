module.exports= function(app) {

        var fs=require('fs');
        var db_utils=require('./db_utils.js');
        var regex_lib_js = /^\/lib.+\.js/;
        var regex_js = /.+\.js/;
        var regex_css = /.+\.css/;
        var regex_html=/.+\.html/;
        var regex_dijit_claro=/dijit.+claro\.css/;
        var regex_claro=/claro\.css/;
        var regex_dojo=/.+dojo\.js/;
        var regex_appstates = /.+AppStates\.js/;
        var regex_dojo_dijit=/.+dojo.+dijit\.js/;
        var regex_dojo_gridx=/.+gridx.+Grid\.js/;


        general_func=function(request,response,next) {
	    console.log(request.url);
	    if (request.method == "GET" && regex_js.test(request.url)) {
		if(!regex_dojo.test(request.url) && !regex_appstates.test(request.url)
		      && !regex_dojo_dijit.test(request.url) && !regex_dojo_gridx.test(request.url)) {
			js_func(request,response);
		}
	   } else if (request.method == "GET" && regex_css.test(request.url)) {
	       if(!regex_dijit_claro.test(request.url)) {
		       css_func(request,response);
	       }
	   } else if (request.method == "GET" && ( request.url == '/' || regex_html.test(request.url) )) {
	       response.render('kwyk1');
			    //keep the below group for reference
			    //response.writeHead(200,{'Content-Type':'text/html','Content-Length':fs.statSync('kwyk1.html').size});
			    //response.write(fs.readFileSync('kwyk1.html',{encoding:'utf8'},function(err,data) {if(err) console.log(err);}));
			    //response.end();
	   }
	   next();
	};
        response_common=function(request,response,content_type) {
	    response.set('Content-Type',content_type);
	    response.send(fs.readFileSync('.'+request.url,{encoding:'utf8'}));
	        };
        js_func=function(request,response) {response_common(request,response,'text/javascript');};
        css_func=function(request,response) {response_common(request,response,'text/css');};
        img_func=function(request,response) {
	    var image_type = 'image/'+request.url.slice(request.url.length-3,request.url.length);
	    response_common(request,response,image_type);
	};
        routes_kwyk1   = [{'method':'use','path':'','func': general_func},
			  {'method':'get','path':'/lib/dojo/dojo/dojo.js','func':js_func},
			  {'method':'get','path':'/lib/maqetta/AppStates.js','func':js_func},
			  {'method':'get','path':'/lib/dojo/dijit/dijit.js','func':js_func},
			  {'method':'get','path':'/lib/dojo/gridx/Grid.js','func':js_func},
			  {'method':'get','path':'/themes/dijit/themes/claro/claro.css','func':css_func},
			  {'method':'get','path':'/lib/dojo/dojo/resources/blank.gif','func':img_func},
			  {'method':'get','path':'/themes/dijit/themes/claro/layout/images/tabClose.png','func':img_func},
			  {'method':'get','path':'/lib/dojo/gridx/resources/images/row_back.png','func':img_func},
			  {'method':'get','path':'/lib/dojo/gridx/resources/images/claro-grid-header-onepixel.bmp','func':img_func}];


        routes_kwyk1.forEach(function(route) { route.path ? app[route.method](route.path,route.func) : app[route.method](route.func);});

        app.get('/',function(request, response) {db_utils.test_mongo();});

};
