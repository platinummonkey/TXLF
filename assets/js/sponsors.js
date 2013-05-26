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
        cache: true,
        success: function(data) {
          console.log("clearing DOM");
		  $("#sponsors-list").empty();
		  console.log("filling in sponsors");
		  $.each(data.nodes, function (i, node) {
			  //console.log(node.node);
			  sponsor = '<li class="' + node.node.field_sponsorship_level + '">'
					    + '<a class="avatar link" href="' + node.node.field_sponsor_link + '"><img src="' + node.node.field_sponsor_logo + '" alt="' + node.node.title + '" /></a>'
					    + '<a class="link" href="' + node.node.field_sponsor_link + '">' + node.node.title + '</a><br />'
					    + '<span class="sponsorlevel">' + node.node.field_sponsorship_level + ' Sponsor - ' + node.node.body + '...</span></li>';
			  $('#sponsors-loading').remove();
			  $("#sponsors-list").append(sponsor);
			  setTimeout(theScroll.refresh(), 1000);
		  });
        },
        error: function(e) {
           console.log(e.message);
        }
     });
	console.log('done sponsors');
	return false;
};

addClassNameListener("sponsors-content", function(){ getSponsors(); });
/* End Sponsors */
