// All button clicks with gui handled here
//Instructor object
var InstructorClass = require('./src/Instructor.js');
//Assistant object
var AssistantClass = require('./src/Assistant.js');
//Course object
var CourseClass = require('./src/Course.js');


function showCoursesClicked() {
	user.showCourses();
}

function addCourseClicked() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	
	//Make checkboxes 1 or 0
	if(data.active=="on") data.active=1;
	else data.active=0;
	
	if(data.mandatory=="on") data.mandatory=1;
	else data.mandatory=0;
	
	//Get all instructors from inputs
	instructorArray=[];
	xi=1;
	while(data["instructors"+xi] != undefined){
		instructorArray.push(data["instructors"+xi]);
		xi++;
	}

	//Get all instructors from inputs
	assistantArray=[];
	xi=1;
	while(data["assistants"+xi] != undefined){
		assistantArray.push(data["assistants"+xi]);
		xi++;
	}
	user.addCourse(data.courseName,data.courseCode,data.courseCredit,data.courseEcts,data.coursePrequirities,
		data.mandatory,data.active,data.semester,instructorArray,assistantArray);
	
}

function editCourseClicked() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	
	//Make checkboxes 1 or 0
	if(data.active=="on") data.active=1;
	else data.active=0;
	
	if(data.mandatory=="on") data.mandatory=1;
	else data.mandatory=0;
	
	//Get all instructors from inputs
	instructorArray=[];
	xi=1;
	while(data["instructors"+xi] != undefined){
		instructorArray.push(data["instructors"+xi]);
		xi++;
	}

	//Get all instructors from inputs
	assistantArray=[];
	xi=1;
	while(data["assistants"+xi] != undefined){
		assistantArray.push(data["assistants"+xi]);
		xi++;
	}
	var instructorsObject = new InstructorClass(instructorArray);
	var assistantsObject = new AssistantClass(assistantArray);
	var courseObject = new CourseClass(data.courseName,data.courseCode,data.courseCredit,data.courseEcts,data.coursePrequirities,data.mandatory,data.active,data.semester,instructorsObject,assistantsObject);

	user.editCourse(courseObject);
	
}



function addcontentmanager() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
}
