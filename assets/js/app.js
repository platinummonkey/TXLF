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
					    + '<span class="sponsorlevel">' + node.node.field_sponsorship_level + ' Sponsor</span></li>';
			  $("#sponsors-list").append(sponsor);
		  });
        },
        error: function(e) {
           console.log(e.message);
        }
     });
	console.log('done sponsors');
};

addClassNameListener("sponsors-content", function(){ getSponsors(); });
