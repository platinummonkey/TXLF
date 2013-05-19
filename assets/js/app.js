/*var theScroll;
function scroll(){
    theScroll = new iScroll('wrapper');
}
document.addEventListener('DOMContentLoaded', scroll, false);
*/
//function page(toPage) {
	//var toPage = $(toPage),
	//fromPage = $("#pages .current");
	//if(toPage.hasClass("current") || toPage === fromPage) {
		//return;
	//};
	//toPage.addClass("current fade.in").one("webkitAnimationEnd", function(){
		//fromPage.removeClass("current fade.out");
		//toPage.removeClass("fade.in")
	//});
	//fromPage.addClass("fade.out");
//}

$('#tab-bar a').on('click', function(e){
        console.log('button clicked');
	e.preventDefault();
        var toPage = $(e.target.hash);
        console.log(toPage);
	//$("#pages .current").removeClass("current");
        fromPage = $("#pages .current");
        console.log(fromPage);
	if(toPage.hasClass("current") || toPage === fromPage) {
		return;
	};
	toPage.addClass("current fade in");//.one("animationend webkitAnimationEnd", function() { //.one("webkitAnimationEnd", function(){
                console.log('animation end');
		//fromPage.removeClass("current fade out");
                fromPage.removeClass();
                console.log('removed classes');
		toPage.removeClass("fade in");
                console.log('removed fade in');
                //toPage.removeClass();
                //toPage.addClass("current");
	//});
	//fromPage.addClass("fade out");
        console.log('finish');
});


// scrolling
var theScroll;
function scroll(){
    theScroll = new iScroll('wrapper');
}
document.addEventListener('DOMContentLoaded', scroll, false);

var scanCode = function() {
    /*window.plugins.barcodeScanner.scan(
        function(result) {
        alert("Scanned Code: " + result.text 
                + ". Format: " + result.format
                + ". Cancelled: " + result.cancelled);
    }, function(error) {
        alert("Scan failed: " + error);
    });*/
    console.log('scanning');
}

function addClassNameListener(elemId, callback) {
    var elem = document.getElementById(elemId);
    var lastClassName = elem.className;
    window.setInterval( function() {   
       var className = elem.className;
        if (className !== lastClassName) {
            callback();   
            lastClassName = className;
        }
    },10);
}

addClassNameListener("scan_qrcode", function(){ scanCode(); });

/* Sponsors */
function getSponsors() {
	console.log("Getting sponsors");
	surl = "http://2013.texaslinuxfest.org/sponsors_mobile";
    $.ajax({
       type: 'GET',
        url: surl,
        async: false,
        jsonpCallback: 'sponsors',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(data) {
          console.log("clearing DOM");
		  $("#sponsors-list").empty();
		  console.log("filling in sponsors");
		  $.each(data.nodes, function (i, node) {
			  //console.log(node.node);
			  sponsor = '<li class="' + node.node.field_sponsorship_level + '">'
					    + '<a class="avatar" href="' + node.node.field_sponsor_link + '"><img src="' + node.node.field_sponsor_logo + '" alt="' + node.node.title + '" /></a>'
					    + '<a href="' + node.node.field_sponsor_link + '">' + node.node.title + '</a><br />'
					    + '<span class="sponsorlevel">' + node.node.field_sponsorship_level + ' Sponsor - ' + node.node.body + '...</span></li>';
			  $("#sponsors-list").append(sponsor);
			  setTimeout(theScroll.refresh(), 1000);
		  });
        },
        error: function(e) {
           console.log(e.message);
        }
     });
	console.log('done sponsors');
};

addClassNameListener("sponsors-content", function(){ getSponsors(); });
/* End Sponsors */

/* Sessions */
// tmp
Session = function(body,experience,session_slot,session_room,session_speakers,nid,path,title) {
    this.init(body,experience,session_slot,session_room,session_speakers,nid,path,title);
}

Session.prototype = {
    init: function(body,experience,session_slot,session_room,session_speakers,nid,path,title) {
        this.body = body;
        this.experience = experience.split(', ');
        this.session_slot = session_slot;
        this.session_room = session_room;
        this.session_speakers = session_speakers.split(', ');
        this.nid = nid;
        this.path = path;
        this.title = title;
        this.startDate = null;
        this.endDate = null;
        this.parseDate();
    },
    parseDate: function() {
        var dateParts = this.session_slot.split(" - "); // should be 4 Ex: "Sat, 06/01/2013 - 9:00am - Sat, 06/01/2013 - 10:00am"
        var stdparts = dateParts[0].split(", ");
        var endparts = dateParts[2].split(", ");
        dateParts[0] = stdparts[1];
        dateParts[2] = endparts[1];
        stdparts = dateParts[0].split('/');
        endparts = dateParts[2].split('/');
        var stdpartsTime = dateParts[1].slice(0,-2).split(':');
        var endpartsTime = dateParts[3].slice(0,-2).split(':');
        if (dateParts[1].charAt(dateParts[1].length-2) == 'p') {
            stdpartsTime[0] = parseInt(stdpartsTime[0]) + 12;
            stdpartsTime[1] = parseInt(stdpartsTime[1]);
        } else {
            stdpartsTime[0] = parseInt(stdpartsTime[0]);
            stdpartsTime[1] = parseInt(stdpartsTime[1]);
        }
        if (dateParts[3].charAt(dateParts[3].length-2) == 'p') {
            if (parseInt(endpartsTime[0]) != 12) {
                endpartsTime[0] = parseInt(endpartsTime[0]) + 12;
            } else {
                endpartsTime[0] = parseInt(endpartsTime[0]);
            }
            endpartsTime[1] = parseInt(endpartsTime[1]);
        } else {
            endpartsTime[0] = parseInt(endpartsTime[0]);
            endpartsTime[1] = parseInt(endpartsTime[1]);
        }
        this.startDate = new Date(stdparts[2], (stdparts[0] -1), stdparts[1], stdpartsTime[0], stdpartsTime[1]);
        this.endDate = new Date(endparts[2], (endparts[0] -1), endparts[1], endpartsTime[0], endpartsTime[1]);
    },
    html: function() {
        if (this.session_speakers.length > 0) {
          speaker = this.session_speakers[0]
          im = "#";
        } else {
          im = "txlflogo.png";
        }
        return '<li class="' + this.session_room + '"<a class="avatar" href="' + im + '"><img src="' + im + '" width="50px" height="50px" alt="' + im + '"></a>';
    },
    getSpeakerImage: function(username) {
        return null;
    }
}

function SessionsCompareRoom(sessionA, sessionB) {
    var AsesRoom = sessionA.session_room.toLowerCase();
    var BsesRoom = sessionB.session_room.toLowerCase();
    if (AsesRoom == BsesRoom) {
        // okay just give up
        return 0;
    } else if ( AsesRoom > BsesRoom) {
        return 1;
    } else {
        return -1;
    }
}

function SessionsCompare(sessionA, sessionB) {
    // first compare dates
    var AStartDate = sessionA.startDate.valueOf();
    var BStartDate = sessionB.startDate.valueOf();
    var AEndDate = sessionA.endDate.valueOf();
    var BEndDate = sessionB.endDate.valueOf();
    if (AStartDate == BStartDate) {
        if (AEndDate == BEndDate) {
            // recurse into Room check
            return SessionsCompareRoom(sessionA, sessionB);
        } else if (AEndDate > BEndDate) {
            return 1;
        } else {
            return -1;
        }
    } else if (AStartDate > BStartDate) {
        return 1;
    } else {
        return -1;
    }
}

Sessions = function(data) {
    this.init(data);
}

Sessions.prototype = {
    init: function(data) {
        this.sessionList = new Array();
        var me = this;
        $.each(data.nodes, function (i, node) {
            me.sessionList.push(new Session(node.node.body, node.node.field_experience, node.node.field_session_slot, node.node.field_session_room, node.node.field_session_speakers, node.node.nid, node.node.path, node.node.title));
        });
        //console.log(this.sessionList);
        console.log('going to sort...');
        this.sessionSort();
        console.log('done sorting...');
    },
    sessionSort: function() {
        this.sessionList.sort(SessionsCompare);
        //console.log(this.sessionList);
    }
}
// end tmp

function getSessions() {
	console.log("Getting sessions");
	surl = "http://2013.texaslinuxfest.org/session-schedule_mobile";
    $.ajax({
       type: 'GET',
        url: surl,
        async: false,
        jsonpCallback: 'sessions',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(data) {
          console.log("clearing DOM");
		  $("#program-content").empty();
		  console.log("filling in sponsors");
		  //console.log(data);
		  sessions = new Sessions(data);
		  console.log(sessions);
		  /*$.each(data.nodes, function (i, node) {
			  //console.log(node.node);
			  sponsor = '<li class="' + node.node.field_sponsorship_level + '">'
					    + '<a class="avatar" href="' + node.node.field_sponsor_link + '"><img src="' + node.node.field_sponsor_logo + '" alt="' + node.node.title + '" /></a>'
					    + '<a href="' + node.node.field_sponsor_link + '">' + node.node.title + '</a><br />'
					    + '<span class="sponsorlevel">' + node.node.field_sponsorship_level + ' Sponsor - ' + node.node.body + '...</span></li>';
			  $("#program-content").append(sponsor);
			  setTimeout(theScroll.refresh(), 1000);
		  });*/
        },
        error: function(e) {
           console.log(e.message);
        }
     });
	console.log('done sessions');
};

addClassNameListener("program-content", function(){ getSessions(); });
var sessions;
/* End Sessions */

