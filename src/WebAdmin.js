//DBHandler object
var DBHandlerClass = require('./DBHandler.js');
var DBHandler = new DBHandlerClass();

//ContentManager Object
var ContentManager = require('./ContentManager.js');

module.exports = class WebAdmin extends ContentManager{
	constructor(username){
		super(username);
	}
	
	publishCourseSchedule(){
		
	}
	

	deleteContentManager(delete_username){
		var DBResult = DBHandler.deleteContentManagerDB(delete_username);
		DBResult.then(function(returnedValue) {
			if(returnedValue = 1){
				$( "#content" ).load("views/delete-content-manager.html");
				alert("Content Manager Deleted");
				
			}
		});
	}
	

	deleteContentManagerHelper(){
		var DBResult =DBHandler.deleteContentManagerHelperDB();//deleteContentManagerHelperDB return usernames as a list.
        DBResult.then(function(usernames) {
            usernames.forEach(function(Username) {
                $("#username1").append(
                    "<option value="+Username+">"+Username+"</option>"
                );
            });
        });
		
	}
	

	addContentManager(){
		
	}
	

	sendEventHelper(){
		
	}
	

	sendEvent(){
		
	}
	
	
	
}
