//WPAPI
var WPAPI = require('wpapi');
//Event object
var EventClass = require('./Event.js');

module.exports = class APIHandler {



	publishScheduleAPI(weeklySchedule){
		// You must authenticate to be able to POST (create) a post
		var apiPromise = WPAPI.discover( 'http://ceng316group7.atwebpages.com' ).then(function( site ) {
		    return site.auth({
		        username: 'admin',
		        password: 'jXHp 4D8r 2anB i5Um gNlX b6dQ'
		    });
		});

		apiPromise.then(function( site ) {
		    // site is now configured to use authentication
		    site.pages().id( 11 ).update({
		   	 // "title" and "content" are the only required properties
		    	title: 'Weekly Course Schedule',
		    	content: weeklySchedule,
		    	// Post will be created as a draft by default if a specific "status"
		    	// is not specified
		    	status: 'publish'
			}).then(function( response ) {
		    	// "response" will hold all properties of your newly-created post,
		    	// including the unique `id` the post was assigned on creation
		    	console.log( response.id );

				return apiPromise;
			}).then(function( site ) {
				//DELETE OLD COURSES PAGE
				getAll( site.pages() ).then(function( allPages ) {
		            allPages.forEach(function(page) {
						if(page.slug != "courses" && page.slug != "weekly-course-schedules"){
							site.pages().id( page.id ).delete().then(function( result ) {
								console.log(result)
							})
						}
					});
				});
				return apiPromise;
			}).then(function( site ) {
				//add new pages
				var wrapperChildren = $("#hiddenCourses").children();

				for (var i = 0; i < wrapperChildren.length; i++) {
				    console.log();
					site.pages().create({
					    // "title" and "content" are the only required properties
					    title: 'CENG'+$(wrapperChildren[i]).attr('id'),
					    content: $(wrapperChildren[i]).html(),
					    // Post will be created as a draft by default if a specific "status"
					    // is not specified
						slug: 'ceng-'+$(wrapperChildren[i]).attr('id'),
					    status: 'publish'
					}).then(function( response ) {
					    // "response" will hold all properties of your newly-created post,
					    // including the unique `id` the post was assigned on creation
					    console.log( response.id );
					})
				}

				return apiPromise;
			}).then(function( site ) {
				//Update Courses pages
				site.pages().id( 18 ).update({
				    // "title" and "content" are the only required properties
				    content: $("#coursesDiv").html(),
				    // Post will be created as a draft by default if a specific "status"
				    // is not specified
				    status: 'publish'
				}).then(function( response ) {
				    // "response" will hold all properties of your newly-created post,
				    // including the unique `id` the post was assigned on creation
				    console.log( response.id );
				})

				alert("Courses And Schedule Published Successfully")
				return 1;
			}).catch(function(error) {
	  		  	console.log(error);
				alert("Operation Failed")
				return 0;
			});

		})

	}

	getEventAPI(){
		var events = [];
		var json = $.getJSON('http://ceng.iyte.edu.tr/wp-json/wp/v2/posts/',function(data){
				return data;
		});
		json.then(function(data){
			data.forEach(function(eventJSON){
				var eventJSONParsed = $.parseJSON(JSON.stringify(eventJSON));
				$("#events").append(
					"<option value='"+(eventJSONParsed.title.rendered+"\n"+eventJSONParsed.content.rendered)+"' id='"+eventJSONParsed.title.rendered+"'>"+eventJSONParsed.title.rendered+"</option>"
				);
				events.push(new EventClass(eventJSONParsed.title.rendered,eventJSONParsed.content.rendered));
			});
			return events;
		}).then(function(val){
				return events;
		}).catch(function(error) {
					console.log(error);
			alert("Operation Failed")
			return 0;
		});






	}

}
