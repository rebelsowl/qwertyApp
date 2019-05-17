//jQuery require
let $ = jQuery = require('jquery');

//DBHandler object
var DBHandlerClass = require('./DBHandler.js');
var DBHandler = new DBHandlerClass();

//Course object
var CourseClass = require('./Course.js');
//Instructor object
var InstructorClass = require('./Instructor.js');
//Assistant object
var AssistantClass = require('./Assistant.js');

module.exports = class ContentManager {
	constructor(username){
		this.username = username;
	}
	showCourses(){
		var DBResult = DBHandler.showCoursesDB();
		
		DBResult.then(function(courseObjects) {
			courseObjects.forEach(function(Course) {
			    $("#tablecontent").append(
			        "<tr>" +
			          "<td>"+Course.courseName+"</td>" +
			          "<td>"+Course.courseCode+"</td>" +
			          "<td>"+Course.courseCredit+"</td>" +
			          "<td>"+Course.courseEcts+"</td>" +
			          "<td>"+Course.coursePrequirities+"</td>" +
			          "<td>"+Course.mandatory+"</td>" +
			          "<td>"+Course.active+"</td>" +
			          "<td>"+Course.semester+"</td>" +
			          "<td>"+Course.instructors+"</td>" +
			          "<td>"+Course.assistants+"</td>" +
			        "</tr>"
			    );
			});
			//Sort Table
	  	  	$("#showCoursesTable").tablesorter();
			
		});
	}
	
	addCourse(courseName,courseCode,courseCredit,courseEcts,coursePrequirities,mandatory,active,semester,instructors,assistants){
		var instructorsObject = new InstructorClass(instructors);
		var assistantsObject = new AssistantClass(assistants);
		var courseObject = new CourseClass(courseName,courseCode,courseCredit,courseEcts,coursePrequirities,mandatory,active,semester,instructorsObject,assistantsObject);
		var DBResult = DBHandler.addCourseDB(courseObject);
		DBResult.then(function(returnedValue) {
			if(returnedValue = 1){
		        $('#add-course-form')[0].reset();  
				alert("Course Added Succesfully")
			}
		});
		
	}
		
}
