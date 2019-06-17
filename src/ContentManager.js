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
//Email object
var EmailClass = require('./Email.js');
//Schedule object
var ScheduleClass = require('./Schedule.js');

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
			console.log(returnedValue);
			if(returnedValue != 0){
		        $('#add-course-form')[0].reset();  
				alert("Course Added Succesfully")
			}
		});
		
	}
		
	editCourseHelper(courseCode){
		//Get all courses
		var DBResult = DBHandler.editCourseHelperDB();
		
		//Just load the course codes to select options
		if(typeof courseCode === 'undefined'){
			DBResult.then(function(courseObjects) {
				courseObjects.forEach(function(Course) {
				    $("#course-select").append(
						"<option value="+Course.courseCode+">CENG"+Course.courseCode+"</option>"
				    );
				});
			});
		} 
		//Load selected course infos into form
		else {
			DBResult.then(function(courseObjects) {
				courseObjects.forEach(function(Course) {
					if (Course.courseCode == courseCode){
						$( "input[name='courseName']" ).val(Course.courseName);
						$( "input[name='courseCode']" ).val(Course.courseCode);
						$( "input[name='courseCredit']" ).val(Course.courseCredit);
						$( "input[name='courseEcts']" ).val(Course.courseEcts);
						$( "input[name='coursePrequirities']" ).val(Course.coursePrequirities);
						$( "input[name='semester']" ).val(Course.semester);
						if (Course.mandatory == 1)
							$("input[name='mandatory']").attr('checked', true);
						if (Course.active == 1)
							$("input[name='active']").attr('checked', true);
						
						//Assistants and intructors
						//First create input boxes
						for (i = 0; i < Course.instructors.length; i++) {
							$( "#addInstructor" ).click();
						}
						for (i = 0; i < Course.assistants.length; i++) {
							$( "#addAssistant" ).click();
						}
						//Add all instructors and assistants to form
						for (i = 1; i < Course.instructors.length+1; i++) {
							$( "input[name='instructors"+i+"']" ).val(Course.instructors[i-1]);
						}
						for (i = 1; i < Course.assistants.length+1; i++) {
							$( "input[name='assistants"+i+"']" ).val(Course.assistants[i-1]);
						}
						
					}
					
				});
			});
		}
			
	}
	
	editCourse(courseObject){
		var DBResult = DBHandler.editCourseDB(courseObject);
		DBResult.then(function(returnedValue) {
			if(returnedValue != 0){
		        $('#add-course-form')[0].reset();  
				alert("Course Updated Succesfully")
			}
		});
	}
	selectCoursesForSemesterHelper(CourseCodes){
        var DBResult =DBHandler.selectCoursesForSemesterHelperDB();
        DBResult.then(function(courseCodes) {
            courseCodes.forEach(function(Course) {
                $("#coursesl").append(
                    "<option value="+Course+">CENG"+Course+"</option>"
                );
            });
        });
    }
	selectCoursesForSemester(course, semester){
		var DBResult = DBHandler.selectCoursesForSemesterDB(course, semester);
		DBResult.then(function(returnedValue) {
			if(returnedValue = 1){
		        $('#select-courses-for-semester-form')[0].reset();  
				alert("Course Semester set")
			}
		});
	}
	deleteCourseHelper(){
        var DBResult =DBHandler.deleteCourseHelperDB();
        DBResult.then(function(courseCodes) {
            courseCodes.forEach(function(Course) {
                $("#coursesl").append(
                    "<option value="+Course+">CENG"+Course+"</option>"
                );
            });
        });
    }
	deleteCourse(course){
		var DBResult = DBHandler.deleteCourseDB(course);
		DBResult.then(function(returnedValue) {
			if(returnedValue = 1){
				$( "#content" ).load("views/delete-course.html");
				alert("Course Deleted");
				
			}
		});
	}
	addEmail(emailGroup,emailName){
		var EmailObject = new EmailClass(emailGroup,emailName);
		var DBResult = DBHandler.addEmailDB(EmailObject);
		DBResult.then(function(returnedValue) {
			if(returnedValue = 1){
		        $('#add-email-form')[0].reset();  
				alert("Email is added")
			}
		});
	}
	setupWeeklyCourseScheduleHelper(){
		var DBResult=DBHandler.setupWeeklyCourseScheduleHelperDB();
		DBResult.then(function(courseCodes) {
            courseCodes.forEach(function(Course) {
                $("#coursesl").append(
                    "<option value="+Course+">CENG"+Course+"</option>"
                );
            });
        });
	}
	setupWeeklyCourseSchedule(courseCode, day, hours){
		hours.forEach(function(hour) {
			console.log(hour);
  			var a = new ScheduleClass(Number(courseCode),Number(day),Number(hour));

  			var check= DBHandler.checkConflict(a);
  			check.then(function(c){
  				console.log('CCCCC  '+ c + '     c')
  				if (c===[] || c=='' || c== undefined) {
		  			var DBResult = DBHandler.setupWeeklyCourseScheduleDB(a);
		  			DBResult.then(function(returnedValue) {
						console.log("returned : "+ returnedValue)
						if(returnedValue == 1){
 						   alert("Course schedule set");
							
				     	   $( "#content" ).load("views/setup-course.html");
						}
					});
		  		}
		  		else
		  			alert('Two courses conflict at that time')

		  	});



		});
	}
	

	showEmails(){
		var DBResult = DBHandler.showEmailsDB();
		DBResult.then(function(emailObjects) {
			emailObjects.forEach(function(Email) {
			    $("#tablecontent1").append(
			        "<tr>" +
			          "<td>"+Email.emailGroup+"</td>" +
			          "<td>"+Email.emailName+"</td>" +
			        "</tr>"
			    );
			});
			//Sort Table
	  	  	$("#showEmailTable").tablesorter();
			
		});
	}


	importEmailList(emailGroup,emails){
		var rv;
		emails.forEach(function (e) {
			var EmailObject = new EmailClass(emailGroup,e);
			var DBResult = DBHandler.addEmailDB(EmailObject);
			DBResult.then(function(returnedValue) {
				if(returnedValue = 1){
						var rv= returnedValue;
				}
			});
		});
			if(rv = 1){
				alert("Email List is Added Succesfully")
			}
	}
		

	editEmail(emailObject,oldmail){
		var DBResult = DBHandler.editEmailDB(emailObject,oldmail);
		DBResult.then(function(returnedValue) {
			if(returnedValue = 1){
		        $('#edit-email-form')[0].reset();  
				alert("Email is updated")
			}
		});
	}
	
	editEmailHelper(mailgroup){
		var DBResult=DBHandler.editEmailHelperDB(mailgroup);
		DBResult.then(function(emails) {
			console.log(emails);
            emails.forEach(function(email) {
                $("#emailname").append(
                    "<option value="+email+">"+email+"</option>"
                );
            });
        });
	}
	
	deleteEmail(email){
		var DBResult = DBHandler.deleteEmailDB(email);
		
		DBResult.then(function(returnedValue) {
			if(returnedValue = 1){
				$( "#content" ).load("views/delete-email.html");
				alert("Email Deleted");
				
			}else{
				alert("Error: Email Not Deleted")
			}
		});
	}
	

	deleteEmailHelper(){
		var DBResult =DBHandler.deleteEmailHelperDB();
        DBResult.then(function(emails) {
            emails.forEach(function(Email) {
				
				$("#email").append(
                   "<option value="+Email.emailName+" id="+Email.emailGroup+">"+Email.emailName+"</option>"
				);
                
            });
        });
	}
	
	
	
}
