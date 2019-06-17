// All button clicks with gui handled here

//Instructor object
var InstructorClass = require('./src/Instructor.js');
//Assistant object
var AssistantClass = require('./src/Assistant.js');
//Course object
var CourseClass = require('./src/Course.js');
//Email object
var EmailClass = require('./src/Email.js')
//Lodash
var _ = require( 'lodash' );



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


function selectCourseClicked() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	if(data.semester=="s1") data.semester=1;
	else if(data.semester=="s2") data.semester=2;
	else if(data.semester=="s3") data.semester=3;
	else if(data.semester=="s4") data.semester=4;
	else if(data.semester=="s5") data.semester=5;
	else if(data.semester=="s6") data.semester=6;
	else if(data.semester=="s7") data.semester=7;
	else if(data.semester=="s8") data.semester=8;

	console.log(data.semester);
	console.log(data.coursesl);
	user.selectCoursesForSemester(data.coursesl,data.semester);

}

function deleteCourseClicked() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});

	user.deleteCourse(data.coursesl);

}

function addMailClicked() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	if(data.group=="instructors") data.group="instructors";
	else if(data.group=="assistants") data.group="assistants";
	else if(data.group=="first-grade") data.group="first-grade";
	else if(data.group=="second-grade") data.group="second-grade";
	else if(data.group=="third-grade") data.group="third-grade";
	else if(data.group=="fourth-grade") data.group="fourth-grade";
	console.log(data.group);
	console.log(data.emailName);
	user.addEmail(data.group,data.emailName);

}

function setupScheduleClicked(){
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	if (data.day =="d1") data.day=1;
	else if(data.day=="d2") data.day=2;
	else if(data.day=="d3") data.day=3;
	else if(data.day=="d4") data.day=4;
	else if(data.day=="d5") data.day=5;

	hoursArray=[];
	xi=1;
	while(data["hours"+xi] != undefined){
		hoursArray.push(data["hours"+xi]);
		xi++;
	}
	console.log(data.coursesl);
	console.log(data.day);
	hoursArray.forEach(function(element) {
  		console.log(element);
	});

	user.setupWeeklyCourseSchedule(data.coursesl,data.day,hoursArray);
}

function publishCourseAndScheduleClicked() {
	user.publishCourseSchedule();
}


function showEmailsClicked() {
	user.showEmails();
}


function importEmailsClicked(email) {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	if(data.group=="instructors") data.group="instructors";
	else if(data.group=="assistants") data.group="assistants";
	else if(data.group=="first-grade") data.group="first-grade";
	else if(data.group=="second-grade") data.group="second-grade";
	else if(data.group=="third-grade") data.group="third-grade";
	else if(data.group=="fourth-grade") data.group="fourth-grade";
	user.importEmailList(data.group,emails);
}


function editEmailClicked() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	var emailObject = new EmailClass(data.emailgroup,data.newemail);
	user.editEmail(emailObject,data.emailname);

}

function deleteEmailClicked() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	if(data.group=="instructors") data.group="instructors";
	else if(data.group=="assistants") data.group="assistants";
	else if(data.group=="first-grade") data.group="first-grade";
	else if(data.group=="second-grade") data.group="second-grade";
	else if(data.group=="third-grade") data.group="third-grade";
	else if(data.group=="fourth-grade") data.group="fourth-grade";
	console.log(data.group);
	console.log(data.email);
	user.deleteEmail(data.email);

}

function sendEventClicked() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	if(data.group=="instructors") data.group="instructors";
	else if(data.group=="assistants") data.group="assistants";
	else if(data.group=="first-grade") data.group="first-grade";
	else if(data.group=="second-grade") data.group="second-grade";
	else if(data.group=="third-grade") data.group="third-grade";
	else if(data.group=="fourth-grade") data.group="fourth-grade";
	console.log(data.group);
	console.log(data.events);
	user.sendEvent(data.events,data.group);
}

function addContentManagerClicked() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});

	console.log(data["username"])
	console.log(data["password"])
	user.addContentManager(data["username"],data["password"]);
}

function deleteContentManagerClicked() {
	console.log("delete content Manager Clicked");
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});

	user.deleteContentManager(data.username1);
}

function getAll( request ) {
  return request.then(function( response ) {
    if ( ! response._paging || ! response._paging.next ) {
      return response;
    }
    // Request the next page and return both responses as one collection
    return Promise.all([
      response,
      getAll( response._paging.next )
    ]).then(function( responses ) {
      return _.flatten( responses );
    });
  });
}
