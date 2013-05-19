/* Sessions */
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

function SessionsCompareNID(sessionA, sessionB) {
	// compare drupal node id (indicates posting date relative to others)
	var Anid = parseInt(sessionA.nid);
	var Bnid = parseInt(sessionB.nid);
	if (Anid == Bnid) {
		// impossible, but whatever -- give up
		return 0;
	} else if (Anid > Bnid) {
		return 1;
	} else {
		return -1;
	}
}

function SessionsCompareRoom(sessionA, sessionB) {
    var AsesRoom = sessionA.session_room.toLowerCase();
    var BsesRoom = sessionB.session_room.toLowerCase();
    if (AsesRoom == BsesRoom) {
        // recurse into NID check
        return SessionsCompareNID(sessionA, sessionB);
    } else if ( AsesRoom > BsesRoom) {
        return 1;
    } else {
        return -1;
    }
}


// Time Grouping
SessionTimeGroup = function(title) {
	this.init(title);
}

SessionTimeGroup.prototype = {
	init: function(title) {
		this.sessionList = new Array();
		this.timerange = title;
	},
	sessionSort: function() {
		this.sessionList.sort(SessionsCompareRoom);
	},
	addSession: function(session) {
		this.sessionList.push(session);
	},
	html: function() {
		var output = '';
		for (var i = 0; i < this.sessionList.length; i++) {
			output = output + '\t\t\t' + this.sessionList[i].html() + '\n';
	}
}

// Day Grouping
SessionDayGroup = function(name) {
	this.init(name);
}

SessionDayGroup.prototype = {
	init: function(name) {
		this.timegroups = {};
		this.fulldayname = name;
	},
	sessionSort: function() {
		for (var key in this.timegroups) {
			this.timegroups[key].sessionSort();
		}
		//this.sessionList.sort(SessionsCompare);
	},
	addSession: function(session) {
		var timestr = session.startDate.toTimeString().slice(0,5) + " - " + session.endDate.toTimeString().slice(0,5);
		if (timestr in this.timegroups) {
			this.timegroups[timestr].addSession(session);
		} else {
			this.timegroups[timestr] = new SessionTimeGroup(timestr);
			this.timegroups[timestr].addSession(session);
		}
	},
	html: function() {
		var output = '';
		for (var key in this.timegroups) {
			output = output + '\n<div id="timeslot">\n\t<h4>' + this.timegroups[key].timerange + '</h4>\n\t\t<ul id="sessions-ul">' + this.timegroups[key].html() + '\n\t\t</ul>\n</div>';
		}
		return output;
	}
}

Sessions = function(data) {
    this.init(data);
}

Sessions.prototype = {
    init: function(data) {
        this.days = {};
        this.days['Fri'] = new SessionDayGroup('Friday May 31, 2013');
        this.days['Sat'] = new SessionDayGroup('Saturday June 1, 2013');
        var me = this;
        $.each(data.nodes, function (i, node) {
            me.addSession(new Session(node.node.body, node.node.field_experience, node.node.field_session_slot, node.node.field_session_room, node.node.field_session_speakers, node.node.nid, node.node.path, node.node.title));
        });
        //console.log(this.sessionList);
        console.log('going to sort...');
        this.sessionSort();
        console.log('done sorting...');
    },
    addSession: function(session) {
		if (session.startDate.getDay() == 5) { // Friday
			this.days['Fri'].addSession(session);
		} else {
			this.days['Sat'].addSession(session);
		}
	},
	sessionSort: function() {
		this.days['Fri'].sessionSort();
		this.days['Sat'].sessionSort();
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
		  //$("#program-content").empty();
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
