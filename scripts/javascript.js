//////////////////////// JAVASCRIPT FOR FREDDIE GRAY /////////////////////

var app = app || {
	
	init: function(){

		app.populate_mobile_info();
		app.update_info(1);
		app.slide_functions();
		app.lightbox();
		app.share();
		
	},
	
	current_slide: 1,
	
	slide_to: function(num){
		

		//Take care of all the actual movement

		if (Modernizr.csstransforms){
			
			var new_position = "-"+(num-1)*100+"%";
		
			//Slide using css transforms
			$("#slider")
				.css("transform","translateY("+new_position+")")
				.css("-webkit-transform","translateY("+new_position+")")
				.css("-moz-transform","translateY("+new_position+")")
				.css("-ms-transform","translateY("+new_position+")")
				.css("-o-transform","translateY("+new_position+")");
			
		} else {
	
			//Legacy support
			$("#slider").css("top",-(num-1)*100+"%");
			
		}
		

		//Update current_slide
		app.current_slide = num;

		//Update info
		app.update_info(num);



	},
	
	slide_functions: function(){
		
		var total_slides = 8;
		
		//Slide down
		$(".down").on("click", function(){
						
			//Check our limit
			if (app.current_slide < total_slides){
				app.current_slide++;
				app.slide_to(app.current_slide);					
			}
			
			//Let's hide this button if it's irrelevant (at the limit)			
			// if (app.current_slide === total_slides){
			// 	$(".down").addClass("inactive")
			// } else {
			// 	$(".direction").removeClass("inactive");
			// }
			
			
		});
		
		//Slide up
		$(".up").on("click", function(){
						
			//Don't go past the first
			if (app.current_slide > 1){
				app.current_slide--;
				app.slide_to(app.current_slide);
			}
			
			//Let's hide this button if it's irrelevant (at the limit)
			// if (app.current_slide === 1){
			// 	$(".up").addClass("inactive")
			// } else {
			// 	$(".direction").removeClass("inactive");
			// }
			
		});

		//Restart
		$("#restart-btn").on("click", function(){
			app.slide_to(1);
		});
		
		
	},

	info_timeout: '',

	update_info: function(id){

		//As we update all the info, we will hide our info window for a split second
		$("#info").addClass("hidden");

		clearTimeout(app.info_timeout);

		app.info_timeout = setTimeout(function(){

			//Special case for the splash page
			if (id === 1){

				$("#info").addClass("splash");
				$("#splash").removeClass("hidden");

				$("#time").addClass("hidden");
				$("#location").addClass("hidden");

				//Update description
				$("#desc p").html(app.info[id-1].desc);

				//Don't forget to bring back the window
				$("#info").removeClass("hidden");

			} else if (id === 8){

				$("#more-coverage").removeClass("hidden");
				$("#credits").removeClass("hidden");

				
			} else {

				$("#info").removeClass("splash");
				$("#splash").addClass("hidden");

				$("#time").removeClass("hidden");
				$("#location").removeClass("hidden");

				//Update time
				$("#time span").text(app.info[id-1].time); //Subtracting one for our info arrya's zero-based index

				//Update location
				$("#location").html(app.info[id-1].location);

				//Update description
				$("#desc p").html(app.info[id-1].desc);

				//Don't forget to bring back the window
				$("#info").removeClass("hidden");

			}

		}, 300);

	
		//Get rid of the conclusion slide elements without delay if we aren't sliding there
		if (id != 8){
			$("#more-coverage").addClass("hidden");
			$("#credits").addClass("hidden");
		}

	},

	lightbox: function(){

		//Map
		$("#map-btn").on("click", function(){

			//Load correct image
			$("#map img").attr("src","images/maps/map-"+(app.current_slide-1)+".png")


			//Show map lightbox
			$("#map").removeClass("hidden");
			$("#overlay").removeClass("hidden");
			
		});

		//Video
		$("#video-btn").on("click", function(){

			//Load correct video
			$("#video iframe").attr("src","videos/video-"+(app.current_slide-1)+".html");

			//Show video lightbox
			$("#video").removeClass("hidden");
			$("#overlay").removeClass("hidden");
			
		});

		//Mobile video
		$(".mobile-video").on("click", function(){

			//Load correct video
			$("#mobile-video iframe").attr("src","videos/video-"+(Number($(this).data("ref"))-1)+".html");

			//Show video lightbox
			$("#mobile-video").removeClass("hidden");
			$("#overlay").removeClass("hidden");
			
		});

		//Generic closing of lightbox
		$("#overlay").on("click", function(){
			$(".lightbox").addClass("hidden");
			$(this).addClass("hidden");

			//Close video
			$("#video iframe").attr("src","");
			$("#mobile-video iframe").attr("src","");
		});

		$(".close-lightbox").on("click", function(){
			$(".lightbox").addClass("hidden");
			$("#overlay").addClass("hidden");

			//Close video
			$("#video iframe").attr("src","");
			$("#mobile-video iframe").attr("src","");
		});



	},

	populate_mobile_info: function(){

		//Loop through each slide and populate it with the correct info for display on mobile devices
		$(".mobile-info").each(function(i){

			$(this).find(".mobile-time span").text(app.info[i].time);
			$(this).find(".mobile-location").html(app.info[i].location);
			$(this).find(".mobile-desc").html(app.info[i].desc);

		});

	},



	share: function(){

		$(".icon-twitter").on("click", function(){

			var tweet = "Follow the events on the day of Freddie Gray's arrest in this visual interactive"; //Tweet text
			var url = "http://data.baltimoresun.com/freddie-gray/"; //Interactive URL

			var twitter_url = "https://twitter.com/intent/tweet?text="+tweet+"&url="+url+"&tw_p=tweetbutton";
			window.open(twitter_url, 'mywin','left=200,top=200,width=500,height=300,toolbar=1,resizable=0'); return false;

		});

		$(".icon-facebook").on("click", function(){

			var picture = "http://data.baltimoresun.com/freddie-gray/images/social.jpg"; //Picture URL
			var title = "The 45-minute mystery of Freddie Gray's death"; //Post title
			var description = "Follow the events on the day of Freddie Gray's arrest in this visual interactive"; //Post description
			var url = "http://data.baltimoresun.com/freddie-gray/"; //Interactive URL

	    	var facebook_url = "https://www.facebook.com/dialog/feed?display=popup&app_id=310302989040998&link="+url+"&picture="+picture+"&name="+title+"&description="+description+"&redirect_uri=http://www.facebook.com";    		
			window.open(facebook_url, 'mywin','left=200,top=200,width=500,height=300,toolbar=1,resizable=0'); return false;

		});

	},

	info: [
		{"id":1,"time":" ","desc":"Freddie Gray, 25, first made eye contact with a Baltimore Police lieutenant at 8:39 a.m. on the cool morning of April 12. At 9:24 a.m., a medic unit was called to the Western District police station, where Gray was in &ldquo;serious medical distress&rdquo; from a severe spinal injury. What happened in the 45 minutes in between largely remains a mystery, though local residents who say they witnessed moments along the way say Gray's arrest and officers' subsequent enforcement of it were anything but normal.","location":" "},
		{"id":2,"time":"8:39","desc":"A Baltimore Police lieutenant on a bicycle makes eye contact with Freddie Gray near the intersection of W. North Avenue and N. Mount Street. Gray &ldquo;fled unprovoked,&rdquo; police said, leading the lieutenant and other bicycle officers in the area to begin pursuing him.","location":"Mount and North intersection"},
		{"id":3,"time":"8:40-8:46","desc":"Gray is arrested and placed in a police transport van. Police say this is done &ldquo;without force or incident,&rdquo; but some residents of the neighborhood describe a more violent encounter and video from a passerby at the scene shows Gray in pain and dragging his feet.","location":"1700 Block of Presbury street"},
		{"id":4,"time":"8:46-8:54","desc":"Police say Gray is acting &ldquo;irate&rdquo; in the back of the van. The van is stopped and Gray is placed in leg shackles and repositioned in the van. Some residents describe a violent encounter.","location":"Mount and Baker streets"},
		{"id":5,"time":"8:54-8:59","desc":"As the van travels toward Central Booking, the driver again stops near the intersection of Druid Hill Avenue and Dolphin Street and calls for an officer to check on Gray. After the check, which has not been described, occurs, the van is requested to return to the 1600 block of W. North Avenue to pick up another individual.","location":"Travel to Druid Hill &amp; Dolphin Street"},
		{"id":6,"time":"8:59-9:24","desc":"The van travels back to W. North Avenue and picks up a second suspect. Police have declined to give a specific time for this pick-up. They have also declined to identify the second suspect, saying he is now a witness in the criminal investigation.","location":"Travel to Dolphin Street &amp; 1600 North Ave"},
		{"id":7,"time":"9:24","desc":"Paramedics are called to the Western District police station, where Gray is described as being in &ldquo;serious medical distress.&rdquo; He is taken to Maryland Shock Trauma Center, where he dies a week later.","location":"1000 block of N. Mount Street"},
		{"id":8,"time":"","location":"","desc":""}
	]
	
}

$(document).ready(function(){
	app.init();
});

