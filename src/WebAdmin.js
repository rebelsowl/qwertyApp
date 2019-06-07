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
	

	deleteContentManager(){
		
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
