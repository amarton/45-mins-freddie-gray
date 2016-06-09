//////////////////////// JAVASCRIPT FOR PROTEST SIGNS /////////////////////

var app = {

	init: function(){

		app.download_data();
		app.lightbox_events();
		app.share_pic();
		app.share();


	},

	download_data: function(){

		// Query the Fusion Table
		var query = "SELECT 'rowid', 'caption', 'credit', 'src', 'location', 'twitpic', 'host' FROM " + '1evP7nWkOIWEkEDAzqTdZOxnNUhtwmbokDqCQ_VGA';
		var encodedQuery = encodeURIComponent(query);

		// Construct the URL
		var url = ['https://www.googleapis.com/fusiontables/v1/query'];
		url.push('?sql=' + encodedQuery);
		url.push('&key=AIzaSyBdWG-uP6bBLhtl7Qq5b8wCHds2tCkuhrQ');
		url.push('&callback=?');

		// Send the JSONP request using jQuery
		$.ajax({
			url: url.join(''),
			dataType: 'jsonp',
			success: function (data) {

				var rows = data['rows'];

				for (var i in rows) {

					var id = Number(rows[i][0]);
					var caption = rows[i][1];
					var credit = rows[i][2];
					var src = rows[i][3];
					var location = rows[i][4];
					var twitpic = rows[i][5];
					var host = rows[i][6];

					app.pic_data.push({"id":id,"caption":caption,"credit":credit,"src":src,"location":location,"twitpic":twitpic,"host":host})

				}

				//We run both these function here because it must wait until our pic_data object is created
				app.populate_photos();
				app.load_hash();

			}

		});


	},

	populate_photos: function(){

		var code;

		//Let's loop through the protests marked as Baltimore
		var bmore_protests = $.grep(app.pic_data, function(e){
				return (e.location === "baltimore");
			});
		

		for (var key in bmore_protests){

			code = '';
			code += '<div class="grid-item" data-id="'+bmore_protests[key].id+'">';
			code += '<img class="" src="'+app.generate_piclink(bmore_protests, key, 600)+'" />';				
			code += '<div class="overlay"></div><div class="expand"><span class="icon-expand"></span></div><div class="share-tools"><div class="group"><span class="icon-twitter2"></span><span class="icon-facebook2"></span></div>';
            code += '<div class="mobile-caption">'+bmore_protests[key].caption+'<div class="mobile-credit">'+bmore_protests[key].credit+'</div></div></div></div>';

			$("#baltimore").append(code);

		}


		//Now let's loop through the protests marked as National
		var national_protests = $.grep(app.pic_data, function(e){
				return (e.location === "national");
			});
		
		for (var key in national_protests){

			code = '';
			code += '<div class="grid-item" data-id="'+national_protests[key].id+'">';
			code += '<img class="" src="'+app.generate_piclink(national_protests, key, 600)+'" />';				
			code += '<div class="overlay"></div><div class="expand"><span class="icon-expand"></span></div><div class="share-tools"><div class="group"><span class="icon-twitter2"></span><span class="icon-facebook2"></span></div>';
            code += '<div class="mobile-caption">'+national_protests[key].caption+'<div class="mobile-credit">'+national_protests[key].credit+'</div></div></div></div>';

			$("#national").append(code);

		}


	},


	fade_in_photos: function(){

		$("img").on("load",function(){
			$(this).addClass("visible");
		});

	},

	load_hash: function(){

		var hash = location.hash.slice(1);
		
		//Check the hash against the available slugs; only run if it matches one
		if (app.test_hash(hash)){
			app.place_lightbox();
			app.open_lightbox(hash);
		}

	},

	test_hash: function(hash){

		for (var key in app.pic_data){
			if (app.pic_data[key].id === Number(hash)){
				return true;
			}
		}

		return false;

	},	

	lightbox_events: function(){

		//Position lightbox
		app.place_lightbox();

		//Card click events
		$("#grids").on("click", ".grid-item .overlay", function(){
			var id = $(this).parent().data("id");
			app.open_lightbox(id);

			//Update lightbox with id to inform the social tools
			$("#lightbox-tools").attr("data-id",id);

		});

		$("#grids").on("click", ".grid-item .expand", function(){
			var id = $(this).parent().data("id");
			app.open_lightbox(id);

			//Update lightbox with id to inform the social tools
			$("#lightbox-tools").attr("data-id",id);			
		});


		//Credit toggling
		$("#lightbox-content").on("click",".icon-arrow-down3", function(){
			app.toggle_lightbox_credit("close");
		});

		$("#lightbox-content").on("click",".icon-arrow-up3", function(){
			app.toggle_lightbox_credit("open");
		});


		//Close events
		$("#lightbox .icon-close").on("click", function(){
			app.close_lightbox();
		});

		$("#lightbox-overlay").on("click", function(){
			app.close_lightbox();
		});

		$("#close-lightbox-overlay").on("click", function(){
			app.close_lightbox();
		});

		$(window).resize(function(){
			app.place_lightbox();
		});

	},

	place_lightbox: function(){

		//Maximize lightbox size based on window size
		if (window.innerHeight < 850){
			$("#lightbox-img img").css("width", window.innerHeight-50 + "px").css("height", window.innerHeight-50 + "px");
		} else {
			$("#lightbox-img img").css("width", "800px").css("height","800px");			
		}

		//Grab new lightbox size
		var lb_height = $("#lightbox").height();

		//Calculate new position
		var top_position = (window.innerHeight - lb_height)/2;
		$("#lightbox").css("top", top_position+"px");

		//console.log(window.innerHeight, lb_height, top_position);

	},

	open_lightbox: function(id){

		//Show lightbox and overlay
		$("#lightbox-overlay").addClass("visible");
		$("#lightbox").addClass("visible");

		//Prevent scrolling
		$("body").addClass("frozen");

		//Populate lightbox info
		var chosen = $.grep(app.pic_data, function(e){
				return (e.id === Number(id));
			});



		$("#lightbox-img img").attr("src",app.generate_piclink(chosen, 0, 800));
		$("#lightbox-credit-text").html(chosen[0].caption+"<span> ("+chosen[0].credit+") </span>");
		$("#lightbox-tools a").attr("href","http://data.baltimoresun.com/valentines/images/valentines/800x800/"+id+".jpg");

	},

	close_lightbox: function(){

		$("#lightbox-overlay").removeClass("visible");
		$("#lightbox").removeClass("visible");

		//Remove old image first to prevent issues if new image is loading
		setTimeout(function(){
			$("#lightbox-img img").attr("src","");
		}, 500);

		$("body").removeClass("frozen");

		//Reshow caption
		app.toggle_lightbox_credit("open");

	},

	toggle_lightbox_credit: function(direction){

		if (direction === "close"){

			$("#lightbox-credit").addClass("hidden");
			$("#lightbox-credit-toggle span").attr("class","icon-arrow-up3");

		}

		if (direction === "open"){

			$("#lightbox-credit").removeClass("hidden");
			$("#lightbox-credit-toggle span").attr("class","icon-arrow-down3");

		}

	},

	tweet_item: function(id){

		var chosen = $.grep(app.pic_data, function(e){
				return (e.id === Number(id));
			});

		var tweet = "Check out signs from the Freddie Gray protests. "+chosen[0].twitpic;
		var url = "http://data.baltimoresun.com/freddie-gray/protest-signs/%23"+id;
		var hashtag = "FreddieGray";

		var twitter_url = "https://twitter.com/intent/tweet?text="+tweet+"&url="+url+"&tw_p=tweetbutton&hashtags="+hashtag;
		window.open(twitter_url, 'mywin','left=200,top=200,width=500,height=300,toolbar=1,resizable=0'); return false;

	},

	facebook_item: function(id){

		var chosen = $.grep(app.pic_data, function(e){
				return (e.id === Number(id));
			});

		var picture = app.generate_piclink(chosen, 0, 600); //Picture URL
		var title = "Signs of the Freddie Gray protests"; //Post title
		var description = "Check out signs from the Baltimore and national protests inspired by Freddie Gray"
		
		//Escape any hashtags with URL encoding
		// description = description.replace(/#/g,"%23");

		// //Escape any ampersands with URL encoding
		// description = description.replace(/&/g,"%26");	

		var url = "http://data.baltimoresun.com/";

		var facebook_url = "https://www.facebook.com/dialog/feed?display=popup&app_id=310302989040998&link="+url+"&picture="+picture+"&name="+title+"&description="+description+"&redirect_uri=http://www.facebook.com";    		
		window.open(facebook_url, 'mywin','left=200,top=200,width=500,height=300,toolbar=1,resizable=0'); return false;

	},

	share_pic: function(){

		//Via the lightbox

		$("#lightbox-tools .icon-twitter2").on("click", function(){

			var id = $(this).parent().attr("data-id");
			app.tweet_item(id);

		});

		$("#lightbox-tools .icon-facebook2").on("click", function(){

			var id = $(this).parent().attr("data-id");
			app.facebook_item(id);

		});


		//Via the grid layout

		$("#grids").on("click",".share-tools .icon-twitter2", function(){

			var id = $(this).parent().parent().parent().attr("data-id");
			app.tweet_item(id);

		});

		$("#grids").on("click",".share-tools .icon-facebook2", function(){

			var id = $(this).parent().parent().parent().attr("data-id");
			app.facebook_item(id);

		});


	},	

	share: function(){

		$(".icon-twitter").on("click", function(){

			var tweet = "Check out signs from the Baltimore and national protests inspired by Freddie Gray"
			var url = "http://data.baltimoresun.com/freddie-gray/protest-signs/"
			var hashtag = "FreddieGray";

			var twitter_url = "https://twitter.com/intent/tweet?text="+tweet+"&url="+url+"&tw_p=tweetbutton&hashtags="+hashtag;
			window.open(twitter_url, 'mywin','left=200,top=200,width=500,height=300,toolbar=1,resizable=0'); return false;

		});

		$(".icon-facebook").on("click", function(){

			var picture = "http://data.baltimoresun.com/freddie-gray/protest-signs/images/600/justice.jpg"; //Picture URL
			var title = "Signs of the Freddie Gray protests"; //Post title
			var description = "Check out signs from the Baltimore and national protests inspired by Freddie Gray"; //Post description
			var url = "http://data.baltimoresun.com/freddie-gray/protest-signs/" //Interactive URL

	    	var facebook_url = "https://www.facebook.com/dialog/feed?display=popup&app_id=310302989040998&link="+url+"&picture="+picture+"&name="+title+"&description="+description+"&redirect_uri=http://www.facebook.com";    		
			window.open(facebook_url, 'mywin','left=200,top=200,width=500,height=300,toolbar=1,resizable=0'); return false;

		});

	},

	generate_piclink: function(arr, key, size){

		//This is to accomodate the pictures coming from two different hosts: data.baltimore.sun or p2p

		if (arr[key].host === "data.baltimoresun.com"){
			return 'http://data.baltimoresun.com/freddie-gray/protest-signs/images/'+size+'/'+arr[key].src;
		} else {
			return arr[key].src+'/'+size+'/'+size+'x'+size;	
		}

	},

	pic_data: []
	
}


$(document).ready(function(){

	app.init();

});
