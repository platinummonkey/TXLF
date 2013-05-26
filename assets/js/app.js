// Must be imported before any other APP JS codesets

// HELPER FUNCTION PROTOTYPES
if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}
// END HELPER FUNCTION PROTOTYPES

// CONSTANT URL PATTERNS
userUrl = "http://2013.texaslinuxfest.org/mobile_services/user/";
userUrlNormal = "http://2013.texaslinuxfest.org/user/";
fileUrl = "http://2013.texaslinuxfest.org/sites/default/files/";
userImageUrl = "http://2013.texaslinuxfest.org/sites/default/files/pictures/";
sessionListUrl = "http://2013.texaslinuxfest.org/session-schedule_mobile";

// END URL PATTERNS

// customize Array.forEach
(function() {
  // Define StopIteration as part of the global scope if it
  // isn't already defined.
  if(typeof StopIteration == "undefined") {
    StopIteration = new Error("StopIteration");
  }

  // The original version of Array.prototype.forEach.
  var oldForEach = Array.prototype.forEach;

  // If forEach actually exists, define forEach so you can
  // break out of it by throwing StopIteration.  Allow
  // other errors will be thrown as normal.
  if(oldForEach) {
    Array.prototype.forEach = function() {
      try {
        oldForEach.apply(this, [].slice.call(arguments, 0));
      }
      catch(e) {
        if(e !== StopIteration) {
          throw e;
        }
      }
    };
  }
})();
//end Array.forEach

// back button support
var LastPage = new Array();

function switchToPage(toPage) {
	console.log(toPage);
	//$("#pages .current").removeClass("current");
    var fromPage = $("#pages .current");
    if (fromPage != undefined) {
		LastPage.push(fromPage);
	}
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
    return;
}

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
    theScroll.refresh()
    document.addEventListener('backbuttom', backPage, false);
}

function rescroll() {
	theScroll.refresh()
}

document.addEventListener('DOMContentLoaded', scroll, false);
document.addEventListener('deviceready', rescroll, false);


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

function backPage() {
	if (LastPage.length > 0) {
		var newpage = LastPage.pop();
		switchToPage(newpage);
		LastPage.pop(); // have to re-pop it to get rid of duplicates.
	}
	setTimeout(theScroll.refresh(), 1000);
	return false;
}

// loading external links in regular browser
function loadURL(url) {
	navigator.app.loadUrl(url, {openExternal:true});
	return false;
}

$('.link').live('tap', function() {
	url = $(this).attr("rel");
	loadURL(url);
});
