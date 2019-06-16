//DBHandler object
var DBHandlerClass = require('./DBHandler.js');
var DBHandler = new DBHandlerClass();

//ContentManager Object
var ContentManager = require('./ContentManager.js');

//APIHandler Object
var APIHandlerClass = require('./APIHandler.js');
var APIHandler = new APIHandlerClass();

//Event object
var EventClass = require('./Event.js');

//NodeMailer
var nodemailer = require('nodemailer');



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
					console.log(courseObjects)

			courseObjects.forEach(function(Course) {
				Course.schedule.forEach(function(schedule) {
					let year = Math.round(Course.semester/2);
					//First Year Table
					$("#year"+year+" tr").eq(schedule.courseTime)[0].cells[schedule.courseDay].innerHTML = "CENG"+schedule.courseCode;
				});
			});
			return courseObjects;
		}).then(function(courseObjects) {
			//First Reset the DIV
			$("#hiddenCourses").html("");
			//Add the new courses
			courseObjects.forEach(function(Course) {
				let courseStatus = "Offered";
				if(Course.active == 0) courseStatus = "Inactive"
				let courseHTML = `
					<div id="${Course.courseCode}">
					<!-- wp:paragraph -->
					<p><strong>${Course.courseName}</strong></p>
					<!-- /wp:paragraph -->

					<!-- wp:paragraph -->
					<p><strong>Instructors:</strong></p>
					<!-- /wp:paragraph -->

					<!-- wp:list -->
					<ul>`;
					Course.instructors.forEach(function(instructor) {
						courseHTML += `<li>${instructor}</li>`
					});
					courseHTML += `
					</ul>
					<!-- /wp:list -->

					<!-- wp:paragraph -->
					<p><strong>Assistants:</strong></p>
					<!-- /wp:paragraph -->

					<!-- wp:list -->
					<ul>`;
					Course.assistants.forEach(function(assistant) {
					courseHTML += `<li>${assistant}</li>`
					});
					courseHTML += `
					</ul>
					<!-- /wp:list -->

					<!-- wp:paragraph -->
					<p><strong>Status:</strong> ${courseStatus}</p>
					<!-- /wp:paragraph -->
					</div>`;

					$("#hiddenCourses").append(courseHTML);
			});
			return courseObjects;
		}).then(function(courseObjects) {
			//first delete old courses div
			$("#coursesDiv").html("");

			//now add new one
			let appendCoursesDiv = `
			<!-- wp:list -->
			<ul>`;
			courseObjects.forEach(function(Course) {
				appendCoursesDiv += `<li><a href="/ceng-${Course.courseCode}/">CENG ${Course.courseCode}</a></li>`
			});
			appendCoursesDiv +=`
			</ul>
			<!-- /wp:list -->`;
			console.log(appendCoursesDiv)
			$("#coursesDiv").append(appendCoursesDiv);
			return 1;
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
		APIHandler.getEventAPI();
	}


	sendEvent(event,group){
		let alerted = false;
		var DBResult = DBHandler.sendEventDB(group);
		DBResult.then(function(emails) {
				emails.forEach(function(emailAddress) {

					var message = event;
					var title = message.split("\n",1)[0];
					var toEmail = emailAddress;
					let transporter = nodemailer.createTransport({
					service: 'gmail',
					secure: false,
					port: 25,
					auth: {
						user: 'iytecengmanagement@gmail.com',
						pass: 'Webadmin12'
					},
					tls: {
						rejectUnauthorized: false
					}
					});

					let HelperOptions = {
					from: '"Web Admin" <iytecengmanagement@gmail.com',
					to: toEmail,
					subject: title,
					html: message
					};



					transporter.sendMail(HelperOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}
						if(!alerted){
							alert("Mails successfully sent");
							alerted = true;
						}
						console.log("The message was sent!");
						console.log(info);
						
					});
					

				});
		});
	}



}
