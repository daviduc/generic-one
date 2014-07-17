var nmci=false;
var ie_version=0;
var selected_derived="NA";
var selected_rindex=0;
var spin_target;
var spinner;
var opts = {
		lines:13, 
		length:20,
		width:10,
		radius:30,
		corners:1,
		rotate:0,
		direction:1,
		color:'#000',
		speed:1,
		trail:60,
		shadow:false,
		hwaccel:false,
		className:'spinner',
		zIndex:2e9,
		top:'auto',
		left:'auto'
};
if($.browser.msie==true & $.browser.version<9) {
	nmci=true;
	ie_version=$.browser.version;
}
if(nmci==true) {    
	Array.prototype.indexOf = function(elt /*,from*/)    {	
		var len=this.length >>> 0;	
		var from = Number(arguments[1]) || 0;	
		from=(from<0)	    ? Math.ceil(from)	    : Math.floor(from);	
		if(from<0)	    
			from += len;	
		for(;from<len;from++)	{	    
			if(from in this &&this[from]===elt)		
				return from;	
		}	
		return -1;    
	};
}

function revertRollback() {    
	$(".revision").each( function(index,Element) {	
		var sel_status;	
		var sel_rev;	
		var document_to_update;	
		sel_status=$(this).attr("data-selected");	
		if(sel_status=="selected" && latest_rev != null) {	    
			sel_rev = $(this).html();	    
			$(this).remove();	    /*get selected revision from couchdb*/	  
			var doc_cmd= "rev="+sel_rev;	    
			$("#stdout").css("display","block");	    
			$.couch.db("agile").openDoc(latest_id, {		
				success: function(data) {		    
					document_to_update=data;		    
					console.log("found latest document to revert to old revision:"+data._rev+", " +
							"latest revision: "+latest_rev);		    
					document_to_update._rev=latest_rev;		    /*put selected revision as update to latest_status*/		    
					$.couch.db("agile").saveDoc(document_to_update, {			
						success: function(data) { 
							refreshLatest(); 
						},			
						error: function(status) {			    
							console.log(status);			
						}		 
					});		
				},		
				error: function(status) {		   
					console.log(status);		
				}
			}, 
			{
				data: doc_cmd /*these are the ajax options*/		
			});	
		}    
	});
};
var latest_status=null;
var latest_rev=null;
var latest_id=null;
refreshLatest();
function refreshLatest() {    
	latest_status=null;
	latest_rev=null;
	latest_id=null;    
	$.couch.db("agile").view("last_status/doc_id", {    
		success: function(data) {	
			$.each(data.rows,function(index,row) {	    
				$.couch.db("agile").openDoc(row.value[0], {		
					success: function(docum) {		    
						latest_status=docum;		    
						latest_rev=latest_status._rev;		    
						latest_id=latest_status._id;		    
						init_form();		    
						console.log("refreshLatest");		    
						$("#stdout").css("display","none");		
					}
				})
			})
		},    
		group:true    
	});
}
function loadDerived(hi_reqt) {    
	var default_option="NA";    
	$("#stdout").css("display","block");    
	lower=hi_reqt.toLowerCase();    
	$.couch.db("agile").view(lower+"/derived_count", {	
		success: function(data) {	    
			$("#form_req_select").children().remove().end();	    
			$.each(data.rows, function(index,row) {		
				if(default_option=="NA") 
					default_option=row.key;		
				$('<option value=\"'+row.key+'\">'+row.key+'</option>').appendTo("#form_req_select");	    
			});	    
			loadStats(default_option);	
		},	
		group: true    
	});
}
function val_est() {    
	var proposed_val = $("#estimate_hours").val();    
	if (proposed_val < latest_status['Spent.Hours'][selected_rindex]) {	
		$("#notification_area").css("display","block");	
		$("#notification_area").html('<span>ERROR:</span> Estimate can not be smaller than actual.');	
		$("#estimate_hours").val(latest_status['Spent.Hours'][selected_rindex]);    
	} else $("#notification_area").css("display","none");
}
function val_act() {    
	var proposed_val = $("#actual_hours").val();    
	if (proposed_val < latest_status['Spent.Hours'][selected_rindex]) {	
		$("#notification_area").css("display","block");	
		$("#notification_area").html('<span>ERROR:</span> Update to actual can not be less than current actual.');	
		$("#actual_hours").val(latest_status['Spent.Hours'][selected_rindex]);    
	} else {	
		$("#notification_area").css("display","none");    
	}
};
function val_perc() {    
	var proposed_val = $("#comp_perc").val();    
	if (proposed_val < 0 || proposed_val >100 ) {	
		$("#notification_area").css("display","block");	
		$("#notification_area").html('<span>ERROR:</span> Completion percentage must be from 0 to 100.');	
		$("#comp_perc").val(latest_status['Percent.Complete'][selected_rindex]);    
	} else $("#notification_area").css("display","none");
};			      
function loadStats(reqt) {    
	selected_derived=reqt;    
	var reqt_desc="NA";
	var reqt_est=0;
	var reqt_acts=0;
	var resource_name;
	var perc_comp=0;
	var strt_dte;
	var sourcefile;
	var rindex=0;
	var end_dte;    
	$.each(latest_status['Reqt.ID'], function(index,der_req){ 
		if(der_req==reqt) {	
			rindex = latest_status['Reqt.ID'].indexOf(reqt);	
			selected_rindex=rindex;	/*reqt_desc=latest_status.Description[rindex];*/	
			reqt_desc="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt " +
					"ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco " +
					"laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in " +
					"volupatate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat " +
					"non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";	
			reqt_est=latest_status['Estimate.Total.Hours'][rindex];	
			reqt_acts=latest_status['Spent.Hours'][rindex];	
			resource_name=latest_status['Resource'][rindex];	
			perc_comp=latest_status['Percent.Complete'][rindex]*100;	
			strt_dte=latest_status['Start.Date'][rindex]*1000; /*num secs since jan 1 1970, so need this in milliseconds*/	
			end_dte=latest_status['Finish.Date'][rindex]*1000;	
			sourcefile=latest_status['Sourcefile'][rindex];    
		} 
	});    
	$("#reqt_desc").val(reqt_desc);    
	$("#estimate_hours").val(reqt_est).attr("min",reqt_acts);    
	$("#actual_hours").val(reqt_acts).attr("min",reqt_acts);    
	$("#comp_perc").val(perc_comp).attr("min",0).attr("max",100);    /*UNMODIFABLE SET*/    
	$("#res_name").val(resource_name);    
	sourcefile=sourcefile.substr(31,6);    
	$("#srcfile").val(sourcefile);    
	var dt = new Date(Number(strt_dte));    
	var mt = 1+dt.getMonth(); 
	mt="0"+mt;    
	var dy = "0"+dt.getDate();    
	$("#start_date").val(dt.getFullYear()+"-"+mt.slice(-2)+"-"+dy.slice(-2));    
	if(perc_comp==100) {	
		dt=new Date(Number(end_dte)); 
		mt=1+dt.getMonth();
		mt="0"+mt;
		dy="0"+dt.getDate();	
		$("#end_date").val(dt.getFullYear()+"-"+mt.slice(-2)+"-"+dy.slice(-2));    
	} else {	
		$("#end_date").val(0);   
	}    
	$("#stdout").css("display","none");
}
function commitRecords() {    
	var perform_save=false;    
	$(".pending_change").each( function(index,Element) {        
		var chg;	
		var sel_status;	
		sel_status=$(this).attr("data-selected");	
		chg = $.parseJSON(unescape($(this).attr("data-change-record")));        
		var rindex = latest_status['Reqt.ID'].indexOf(chg['Reqt.ID']);        
		for(change_field in chg) {	    
			if(change_field != "Reqt.ID" & change_field != "Update.Time")  {
				latest_status[change_field][rindex]=chg[change_field];
			};	    
			latest_status['Modified.Date'][rindex]=chg['Update.Time'];	
		}	
		$(this).remove();        
		perform_save=true;			           
	});    /*console.log("commitRecords");*/    
	if(perform_save==true) {	
		$("#stdout").css("display","block");	
		console.log(latest_status._rev);	
		$('<div data-selected="unselected" onclick="clickChangeRecord(event)" class="revision">'+latest_status._rev+'</div>').appendTo("#revert_list");	
		$.couch.db("agile").saveDoc(latest_status, {
			success: function() {
				refreshLatest();
			}
		});	/*console.log(latest_status._rev);*/    
	}		 
}
function saveRec() {    
	if(latest_status!=null && selected_derived != "NA") {	
		var der_req = $("#form_req_select option:selected").val();	
		var der_desc = $("#reqt_desc").val();	
		var der_est_hrs= $("#estimate_hours").val();	
		var der_act_hrs= $("#actual_hours").val();	
		var der_percent=$("#comp_perc").val();	
		var rindex=latest_status['Reqt.ID'].indexOf(der_req);	
		var change_required=new Boolean(false);	
		var localtime=new Date();	
		var change_record={"Reqt.ID": der_req};	
		var change_hint="";	
		change_record["Update.Time"]=localtime;	
		val_est();
		val_act();
		val_perc();	
		if(latest_status['Spent.Hours'][rindex]!=Number(der_act_hrs)) {	    
			change_required=true;            
			change_record["Spent.Hours"]=Number(der_act_hrs);	
		}	
		if(latest_status['Estimate.Total.Hours'][rindex]!=Number(der_est_hrs)) {	    
			change_required=true;	    
			change_record["Estimate.Total.Hours"]=der_est_hrs;	
		}	
		if( latest_status.Description[rindex]!=der_desc) {	    
			change_required=true;	    
			change_record["Description"]=der_desc;	
		}		
		if( latest_status['Percent.Complete'][rindex]*100 != der_percent) {	    
			change_required=true;	    
			change_record['Percent.Complete']=der_percent/100;	
		}	
		if(change_required==true) {	    
			for(change_field in change_record) {
				if(change_field != "Reqt.ID" & change_field != "Update.Time") 
					change_hint += change_field+"->"+change_record[change_field]+"\n";
			}	    
			$('<div data-selected="unselected" onclick="clickChangeRecord(event)" id="'+der_req+'" title="'+change_hint+'" data-change-record="'+escape(JSON.stringify(change_record))+'" class="pending_change">'+der_req+'</div>').appendTo("#pending_changes");           /* $(".pending_change").each(function(index,Element) { console.log($(this).text());});*/	
		}    
	}
}
function clickChangeRecord(mouse_evt) {    
	var evt= mouse_evt || window.event;    
	var current= mouse_evt.target || evt.srcElement;    
	if($(current).attr("data-selected")=="unselected") {	
		$(current).css("color","white");	
		$(current).css("background-color","blue");	
		$(current).attr("data-selected","selected");    
	} else {	
		$(current).css("color","inherit");	
		$(current).css("background-color","inherit");	
		$(current).attr("data-selected","unselected");    
	}
};
function removeRecords() {    
	$(".pending_change").each( function(index,Element) {	
		var sel_status;	
		sel_status=$(this).attr("data-selected");	
		if(sel_status=="selected") {          
			chg = $.parseJSON(unescape($(this).attr("data-change-record")));          	  
			$(this).remove();	
		}    
	});    /*console.log("commitRecords");*/    
};
(function($) {    
	$.fn.html5jTabs = function(options) {	
		return this.each(function(index,value) {	    
			var obj=$(this),objFirst = obj.eq(index),objNotFirst=obj.not(objFirst);	    
			$("#"+objNotFirst.attr("data-toggle")).hide();	    
			$(this).eq(index).addClass("active");	    
			obj.click(function(evt) {		
				toggler="#"+obj.attr("data-toggle");		
				togglerRest=$(toggler).parent().find("div");		
				togglerRest.hide().removeClass("active");		
				$(toggler).show().addClass("active");		
				$(this).parent("div").find("a").removeClass("active");		
				$(this).addClass("active");		
				if(obj.attr("data-toggle")=="reqt") {
					$("#sidebar").show(); 
					$("#pending_changes").show();$(".pending_change").show();
				}		
				return false;	    
			});	
		});    
	};
}(jQuery));

function init_form() {    
	$.couch.db("agile").view("reqts_stats/high_reqt_count",{    
		success: function(data)  {	
			$("#form_hireq_select").children().remove().end();	
			$.each(data.rows, function(index,row) {	    
				$('<option value='+row.key+'>'+row.key+'</option>').appendTo("#form_hireq_select");	    
				var sow_reqt=row.key;	    
				var testdoc= {		
						_id:"_design/"+sow_reqt.toLowerCase(),		
						views:{"derived_count" : { "map" : "function(doc) {if(doc['SOW.Number']){ for(i=0;i<doc['SOW.Number'].length;i++){ if(doc['SOW.Number'][i]==\""+sow_reqt+"\") emit(doc['Re\qt.ID'][i],1 ); } } }", "reduce": "_count"}}	    
				};	    
				$.couch.db("agile").view(sow_reqt.toLowerCase()+"/derived_count", {		
					error : function(error_status) {		    
						$.couch.db("agile").saveDoc(testdoc, {		    });		
					}	    
				});	
			});    
		},    
		group: true    
	});    
	$("#stdout").css("position","fixed").css("top","50%").css("left","50%").css("z-index","100").css("display","none");
	spin_target=document.getElementById("stdout");    
	spinner = new Spinner(opts).spin(spin_target);
}l