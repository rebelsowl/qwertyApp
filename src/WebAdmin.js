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
	

	addContentManager(username, password){
		var DBResult = DBHandler.addContentManagerDB(username,password);
		DBResult.then(function(returnedValue) {
			if(returnedValue = 1){
		        $('#add-content-form')[0].reset();  
				alert("Content Manager Added Succesfully")
			}
		});

	}
	

	sendEventHelper(){
		
	}
	

	sendEvent(){
		
	}
	
	
	
}
