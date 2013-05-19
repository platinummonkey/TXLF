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

// HELPER FUNCTION PROTOTYPES
if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}
// END HELPER FUNCTION PROTOTYPES


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
