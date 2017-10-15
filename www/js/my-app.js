// Initialize app
var myApp = new Framework7({
	init: false
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var base_url = "http://192.168.1.10:8080"
var base_url_bpjs = "http://192.168.1.10:8081"


var polichoosen = "";
var namapolichoosen = "";
var dokterchoosen = "";
var namadokterchoosen = "";
var jadwalchoosen = "";
var kodeharichoosen = "";
var kodewaktuchoosen = "";

var jamMulaiChoosen = "";
var jamSelesaiChoosen  = "";
var tanggalChoosen = "";

var bookingobject = {
	"nobooking" : null,
	"kodebagian" : "",
	"kodedokter" : "",
	"waktudr" : "",
	"typepasien" : "",
	"nopasien" : "",
	"namapasien" : "",
	"utktglreg" : 1507914000000,
	"jamdtg" : "00:00:00",
	"tglpesan" : 1507827600000,
	"jampesan" : null,
	"notelp" : "",
	"valid" : "V",
	"nolantai" : "",
	"nokamar" : "",
	"nott" : "",
	"kdgrptrf" : "",
	"kdgolkls" : "",
	"kdgrkls" : "",
	"tipebooking" : "1",
	"nourutdr" : null
}

var datapasien = {
	nopasien:"aaa0001",
	namapasien:"aas gitu",
}


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})

$$(document).on('pageInit', '.page[data-page="polilist"]', function (e) {
	$("#leftcontent").show();
	
    var jqxhr = $.get( base_url+"/bagian/getall/", function() {
		
	})
	.done(function(data) {
		$("#listpoli").html("");
		for(var i=0;i<data.length;i++){
			$("#listpoli").append(
				"<li>"
				+"<a onclick='gotoDokter(\""+data[i].kodebagian+"\",\""+data[i].namabagian+"\")' href='#' class='item-link item-content'>"
				+"<div class='item-media'><img src='./img/poli/"+data[i].kodebagian+".png' width='80'></div>"
				+"<div class='item-inner'>"
				+"<div class='item-text'>"+data[i].namabagian+"</div>"
				+"</div>"
				+"</a>"
				+"</li>"
			)
		}
	})
	.fail(function(data) {
		alert("network error");
		console.log(data)
	});
});
$$(document).on('pageInit', '.page[data-page="dokterlist"]', function (e) {
	console.log("test");
    var jqxhr = $.get( base_url+"/dokter/getbykodebagian/"+polichoosen, function() {
		
	})
	.done(function(data) {
		$("#listdokter").html("");
		for(var i=0;i<data.length;i++){
			$("#listdokter").append(
				"<li>"
				+"<a onclick='gotoJadwal(\""+data[i].kodedokter+"\",\""+data[i].namadokter+"\")' href='#' class='item-link item-content'>"
				+"<div class='item-media'><img src='./img/dokter/"+data[i].kodedokter+".png' width='80'></div>"
				+"<div class='item-inner'>"
				+"<div class='item-text'>"+data[i].namadokter+"</div>"
				+"</div>"
				+"</a>"
				+"</li>"
			)
		}
	})
	.fail(function(data) {
		alert("network error");
		console.log(data)
	});
});

$$(document).on('pageInit', '.page[data-page="jadwallist"]', function (e) {
	console.log("test");
    var jqxhr = $.get( base_url+"/jadwal/getbydokterandbagian/"+dokterchoosen+"/"+polichoosen, function() {
		
	})
	.done(function(data) {
		$("#listjadwal").html("");
		
		var hari = ["SENIN","SELASA","RABU","KAMIS","JUMAT","SABTU","MINGGU"];
		
		for(var i=0;i<data.length;i++){
			
			console.log(data[i]);
			var jamMulai = formatTime(new Date(data[i].jammulai));
			var jamSelesai = formatTime(new Date(data[i].jamselesai));
			var tgl = formatDate(new Date(data[i].jammulai));

			
			$("#listjadwal").append(
				"<li>"
				+"<a onclick='gotoConfirm(\""+data[i].jammulai+"\",\""+data[i].jwdokterPK.kodewaktu+"\",\""+data[i].jwdokterPK.kodehari+"\",\""+tgl+"\",\""+jamMulai+"\",\""+jamSelesai+"\")' href='#' class='item-link item-content'>"
				+"<div class='item-inner'>"
				+"<div class='item-text'>"
				+hari[parseInt(data[i].jwdokterPK.kodehari)-2]+"<br/>"
				+tgl+" / "
				+jamMulai+" - "
				+jamSelesai+"<br/>"
				+"</div>"
				+"</div>"
				+"</a>"
				+"</li>"
			)
		}
	})
	.fail(function(data) {
		alert("network error");
		console.log(data)
	});
});

$$(document).on('pageInit', '.page[data-page="confirm"]', function (e) {
	var hari = ["SENIN","SELASA","RABU","KAMIS","JUMAT","SABTU","MINGGU"];
	var haritxt = hari[parseInt(kodeharichoosen)-2];
	$("#nama").html("Hari : "+datapasien.nama);
	$("#hari").html("Hari : "+haritxt);
	$("#poli").html("Poli : "+namapolichoosen);
	$("#dokter").html("Dokter : "+namadokterchoosen);
	$("#tanggal").html("Dokter : "+tanggalChoosen);
	$("#jam").html("Jam : "+jamMulaiChoosen+"-"+jamSelesaiChoosen);
	
});

$$(document).on('pageInit', '.page[data-page="login"]', function (e) {
	$("#leftcontent").hide();
	if(localStorage.datapasien!=undefined || localStorage.datapasien!=null){
		var data = JSON.parse(localStorage.datapasien);
		datapasien.namapasien = data.namapasien;
		datapasien.nopasien = data.nopasien;
		datapasien.typepasien = data.jnskelamin;
		mainView.router.load({url:"polilist.html"});
	}
	
});


function doLogin(){
	var nopasien  = $("#username").val();
	var pin  = $("#password").val();
	
	var jqxhr = $.get( base_url+"/pasien/login/"+nopasien+"/"+pin, function() {
	
	})
	.done(function(data) {
		console.log(data);
		if(data!=null){
			localStorage.datapasien = JSON.stringify(data);
			datapasien.namapasien = data.namapasien;
			datapasien.nopasien = data.nopasien;
			datapasien.typepasien = data.jnskelamin;
			mainView.router.load({url:"polilist.html"});
		}
	})
	.fail(function(data){
		alert("username/password salah");
	});
}

function gotoDokter(kodebagian,namabagian){
	polichoosen = kodebagian;
	namapolichoosen = namabagian;
	bookingobject.kodebagian = kodebagian;
	
	mainView.router.load({url:"dokterlist.html"});
}
function gotoJadwal(kodedokter,namadokter){
	dokterchoosen = kodedokter;
	namadokterchoosen = namadokter;
	
	bookingobject.kodedokter = kodedokter;
	
	mainView.router.load({url:"jadwallist.html"});
}
function gotoConfirm(utktglreg,kodewaktu,kodehari,tanggal,jamMulai,jamSelesai){
	kodewaktuchoosen = kodewaktu;
	kodeharichoosen = kodehari;
	jamMulaiChoosen = jamMulai;
	jamSelesaiChoosen = jamSelesai;
	tanggalChoosen = tanggal;
	
	bookingobject.nopasien = datapasien.nopasien;
	bookingobject.namapasien = datapasien.namapasien;
	bookingobject.typepasien = datapasien.typepasien;
	
	bookingobject.utktglreg = utktglreg;
	bookingobject.waktudr = kodewaktu;
	
	
	mainView.router.load({url:"confirm.html"});
}

function formatTime(d){
	
	var hr = d.getHours();
	var min = d.getMinutes();
	if (min < 10) {
		min = "0" + min;
	}
	if (hr < 10) {
		hr = "0" + hr;
	}
	
	return hr+":"+min;
}
function formatDate(d){
	var months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
	var date = d.getDate();
	var month = months[d.getMonth()];
	var year = d.getFullYear();
	
	return date+" "+month+" "+year;
}
function confirmBooking(){
	var url = base_url+'/regbooking/save';
	var data = JSON.stringify(bookingobject);
		
	$.ajax({
	  url:url,
	  type:"POST",
	  data:data,
	  contentType:"application/json; charset=utf-8",
	  dataType:"json",
	  success: function(data){
		console.log(data);
		$("#listconfirm").append("<li id='nrt'><h3>no.urut : "+data.nourutdr+"<h3></li>");
		$("#listconfirm").append("<li id='bcd'><img id='barcode'/></li>");
		$("#barcode").JsBarcode(data.nobooking);
	  },
	  fail:function(a,b,c){
		  alert(a);
	  }
	})
}
function logout(){
	localStorage.datapasien = null;
	window.location = "index.html";
}
function daftar(){
	var tgl = new Date($("#r_tanggallahir").val());
	
	var objectpasien = {
		"nopasien" : null,
		"kodeagama" : "1",
		"kodedarah" : "-",
		"kodedidik" : "-",
		"kodept" : "",
		"namapasien" : ""+$("#r_nama").val(),
		"namaeyd" : ""+$("#r_nama").val(),
		"tmplahir" : ""+$("#r_tempatlahir").val(),
		"tgllahir" : tgl.getTime(),
		"jnskelamin" : ""+$("#r_jeniskelamin").val(),
		"stkawin" : "-",
		"alm1pasien" : ""+$("#r_alamat").val(),
		"alm2pasien" : "",
		"kdpropinsi" : "",
		"kdkota" : "",
		"kotapas" : "",
		"klrhpas" : " ",
		"kecpas" : "",
		"kdpospas" : "",
		"tlppasien" : "",
		"pekerjaan" : "",
		"almpekerja" : "",
		"tlppekerja" : "",
		"allergi" : "",
		"namapgjwb" : ""+$("#r_nama").val(),
		"nikpgjwb" : "",
		"alm1pgjwb" : "",
		"alm2pgjwb" : "",
		"hubpgjwb" : "",
		"notangpas" : 0,
		"tglakhrs" : null,
		"unitakhrs" : "",
		"warganegara" : "",
		"negara" : "",
		"retensi" : "",
		"namapanggilan" : "",
		"kodejbt" : "",
		"kdgrptrf" : "",
		"stspasien" : "",
		"nopasienhistory" : "",
		"kodept1" : "",
		"nopolis" : "",
		"tglawalrs" : null,
		"photo" : "",
		"barcode" : "",
		"hdkunjke" : null,
		"hdkunj1st" : null,
		"kunjfis" : null,
		"nmkantor" : "",
		"dokterhd" : "",
		"dx" : "",
		"hbbsag" : "",
		"tgleditsts" : null,
		"flagraudhah" : "",
		"unitawal" : "",
		"noktp" : "",
		"pjmsts" : "",
		"kdpkrjaan" : "",
		"tglkunja" : null,
		"unitkunja" : "",
		"icdkunja" : ""
	}
	
	var url = base_url+'/pasien/save';
	
	$.ajax({
	  url:url,
	  type:"POST",
	  data:JSON.stringify(objectpasien),
	  contentType:"application/json; charset=utf-8",
	  dataType:"json",
	  success: function(data){
		localStorage.datapasien = JSON.stringify(data);
		datapasien.namapasien = data.namapasien;
		datapasien.nopasien = data.nopasien;
		datapasien.typepasien = data.jnskelamin;
		mainView.router.load({url:"polilist.html"});
		
	  },
	  fail:function(a,b,c){
		  alert(a);
	  }
	})

}
function getbpjs(){
	var url = base_url_bpjs+'/bpjs/get';
	var jqxhr = $.get( url, function() {
		
	})
	.done(function(data) {
		console.log(data);
		mainView.router.load({url:"register.html"});
	})
	.fail(function(data) {
		mainView.router.load({url:"register.html"});
	})
}
myApp.init();