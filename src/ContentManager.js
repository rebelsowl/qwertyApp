//jQuery require
let $ = jQuery = require('jquery');

//DBHandler object
var DBHandlerClass = require('./DBHandler.js');
var DBHandler = new DBHandlerClass();

module.exports = class ContentManager {
	constructor(username){
		this.username = username;
	}
	showCourses(){
		var result = DBHandler.showCoursesDB();
		
		result.then(function(courseObjects) {
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
		});
		
		
	}
	
}
