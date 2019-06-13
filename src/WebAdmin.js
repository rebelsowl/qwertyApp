//DBHandler object
var DBHandlerClass = require('./DBHandler.js');
var DBHandler = new DBHandlerClass();

//ContentManager Object
var ContentManager = require('./ContentManager.js');

//APIHandler Object
var APIHandlerClass = require('./APIHandler.js');
var APIHandler = new APIHandlerClass();




module.exports = class WebAdmin extends ContentManager{
	constructor(username){
		super(username);
	}
	
	publishCourseSchedule(){
		APIHandler.publishScheduleAPI($("#course-schedule").html());
	}
	
	publishCourseScheduleHelper(semester){
		//First reset the the tables
		let x = 0;
		let y = 0;
		
		for(let years=1;years<5;years++){
			$("#year"+years+" tr").each(function () {
				x = $(this).index();
			    $('td', this).each(function () {
					y = $(this).index();
					if(x != 0 && y != 0) $(this).html(" "); 
			     })
			})
		}
		
		//Now add the new oness
		var result = DBHandler.getScheduleDB(semester);
		result.then(function(courseObjects) {
			courseObjects.forEach(function(Course) {
				Course.schedule.forEach(function(schedule) {
					let year = Math.round(Course.semester/2);
					//First Year Table
					$("#year"+year+" tr").eq(schedule.courseTime)[0].cells[schedule.courseDay].innerHTML = "CENG"+schedule.courseCode;
				});
			});			
		});
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
	

	addContentManager(username, password){
		var DBResult = DBHandler.addContentManagerDB(username,password);
		DBResult.then(function(returnedValue) {
			if(returnedValue == 1){
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
