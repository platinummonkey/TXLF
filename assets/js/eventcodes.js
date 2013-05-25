// Festival Event QRCode Scanning

// Setup Database for Lead Retreival
/*var db = null;
var writer;

function dbErrorCB(tx, err) {
	console.log("Error processing SQL: "+err);
}

function dbGetLeadsSuccess(tx, results) {
	var len = results.rows.length;
	console.log("Writing " + len + " rows to csv");
}

function sendEmailLeads() {
	db.executeSql('SELECT * FROM TXLFLEADS', [], dbGetLeadsSuccess, dbErrorCB);
}

function setupDB(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS TXLFLEADS (id unique, name, phone_work, phone_mobile, email, website, title, company, address)');
}

function dbSuccessCB(tx, err) {
	console.log("DB openend successfully");
}

function fail = function(error) {
	console.log(error.code);
}

function gotFileWriter(fwriter) {
	writer = fwriter;
	wrtier.seek(writer.length);
}

function gotFileEntry(fileEntry) {
	fileEntry.createWriter(gotFileWriter, fail);
}

function gotFS(fileSystem) {
	fileSystem.root.getFile("txlf2013_leads.csv", {create: true, exclusive: false}, gotFileEntry, fail);
}

function setupLeads() {
	var dbsize = 2*1024*1024; // 2 MB (LOTS OF CONTACTS)
	db = window.openDatabase("txlf2013_leads", "1.0", "TXLF 2013 Leads Database", dbsize);
    db.transaction(setupDB, dbErrorCB, dbSuccessCB);
    //window.requestFileSystem(LocalFileSystem.PERSISTANT, 0, gotFS, fail);
}

document.addEventListener("deviceready", setupLeads, false);*/

function createContact(name, phone_work, phone_mobile, email, website, title, company, address) {
	// creates contact blindly
	var contact = navigator.contacts.create();
	contact.displayName = name;
	contact.nickname = name; // specify both to support all devices
	
	// populate other fields
	contact.name = name;
	var phoneNumbers = [];
	if (phone_work != null && phone_work != "") {
		phoneNumbers.push(new ContactField('work', phone_work, false));
    }
    if (phone_mobile != null && phone_mobile != "") {
		phoneNumbers.push(new ContactField('mobile', phone_mobile, true));
	}
	contact.phoneNumbers = phoneNumbers;
	if (email != null && email != "") {
		contact.email = [new ContactField('work', email, true)];
	}
	if (website != null && website != "") {
		contact.urls = [new ContactField('work', email, true)];
	}
	if (company != null && company != "") {
		if (title == null || title == "") {
			title = "";
		}
		contact.organizations = [new ContactOrganization(true, 'work', company, "", title)];
	}
	if (address != null && address != "") {
		contact.addresses = [new ContactAddress(true, 'home', address, "", "", "", "", "")];
	}
	
	// mark them as TXLF2013
	contact.note = "TXLF 2013";
	contact.categories = [new ContactField('work', "TXLF 2013", false)];
	
	contact.save(); // save the contact
	return contact;
}

var scanCode = function() {
    window.plugins.barcodeScanner.scan(
        function(result) {
        console.log("Scanned Code: " + result.text 
                + ". Format: " + result.format
                + ". Cancelled: " + result.cancelled);
        var jc = JSON && JSON.parse(result.text) || $.parseJSON(result.text);
        console.log("got contact");
        console.log(jc);
        var newcontact = createContact(jc.n, jc.pw, jc.pm, jc.e, jc.www, jc.t, jc.c, jc.adr);
        console.log("contact created");
        console.log(newcontact);
    }, function(error) {
        alert("Scan failed: " + error);
    });
    console.log('scanning');
    return false;
}

addClassNameListener("scan_qrcode", function(){ scanCode(); });
