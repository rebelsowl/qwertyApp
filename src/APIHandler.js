//WPAPI
var WPAPI = require('wpapi');

module.exports = class APIHandler {
	
	publishScheduleAPI(content){
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
		    	content: content,
		    	// Post will be created as a draft by default if a specific "status"
		    	// is not specified
		    	status: 'publish'
			}).then(function( response ) {
		    	// "response" will hold all properties of your newly-created post,
		    	// including the unique `id` the post was assigned on creation
		    	console.log( response.id );
				alert("Weekly Course Schedule Published")
			}).catch(function(error) {
	  		  	console.log(error);
			});
		})
	}
	
}
