
//Mysql LIB
var mysql = require('mysql2');

// DB Credentials
var connection = mysql.createConnection({
    host     : '95.179.171.18',
    user     : 'qwerty',
    password :  'qwertyApp',
    database : 'qwerty'
});

// connect to mysql
connection.connect(function(err) {
    // in case of error
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
});

//Course object
var CourseClass = require('./Course.js');
//Email object
var EmailClass = require('./Email.js');
//Email object
var ScheduleClass = require('./Schedule.js');

module.exports = class DBHandler {


	 loginDB(username,password){
		// Perform a query
		let $query = 'SELECT * FROM Accounts WHERE username = "'+username+'" AND password = "'+password+'"';

	    var queryPromise = connection.promise().query($query)
	    .then( ([rows,fields]) => {
			let result = [];
			if (rows.length == 1){
				result.push(rows[0]["account_type"]);
				result.push(rows[0]["username"]);
			} else  {
				result.push(3);
			}
			return result;
	    })
	    .catch(console.log);

		return queryPromise;

	}

	showCoursesDB(){
	    //Create Course Objects
		var courseObjects = [];

		// Perform a query
		let $query = 'SELECT * FROM Courses';
		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
			for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				var Course = new CourseClass(currentRow["course_name"],currentRow["course_code"],currentRow["course_credit"],
			 	currentRow["course_ects"],currentRow["course_prerequisite"],currentRow["mandatory/elective"],
			 	currentRow["active/inactive"],currentRow["semester"],new Array(),new Array());
			 	courseObjects.push(Course);
			}

			//Get Instructors of current course
			$query = 'SELECT * FROM Instructors';
		    return connection.promise().query($query)
	    })
	    .then( ([rows,fields]) => {
			//Add them to the corresponding object
			rows.forEach(function(row) {
				courseObjects.forEach(function(Course) {
					if(row.course_code == Course.courseCode){
						Course.instructors.push(row.instructor_name);
					}
				});
			});

			//Get Instructors of current course
			$query = 'SELECT * FROM Assistants';
			return connection.promise().query($query)
	    })
	    .then( ([rows,fields]) => {
			//Add them to the corresponding object
			rows.forEach(function(row) {
				courseObjects.forEach(function(Course) {
					if(row.course_code == Course.courseCode){
						Course.assistants.push(row.assistant_name);
					}
				});
			});
			//Return completed Course object array
			return courseObjects
	    });

		return result;
	}

	addCourseDB(courseObject){
		// Perform a query

		let query = "INSERT INTO Courses (`course_code`, `course_credit`, `course_ects`, `course_name`, `course_prerequisite`, `mandatory/elective`, `active/inactive`, `semester`) ";
		//This field is not mandatory
		if (courseObject.coursePrequirities == "") courseObject.coursePrequirities = 'null';
		query += `VALUES (${courseObject.courseCode}, ${courseObject.courseCredit}, ${courseObject.courseEcts}, '${courseObject.courseName}', ${courseObject.coursePrequirities}, ${courseObject.mandatory}, ${courseObject.active}, ${courseObject.semester})`;
		console.log(query);

		var result = connection.promise().query(query)
	    .then( ([rows,fields]) => {
			console.log(rows);
			let query = "INSERT INTO Assistants VALUES ";
			courseObject.assistants.assistantName.forEach(function(row) {
				query += `(${courseObject.courseCode}, '${row}'),`;
			});
			//Delete the last comma to prevent SQL Error
			query = query.substring(0, query.length-1);
		    return connection.promise().query(query);
	    }).then( ([rows,fields]) => {
			console.log(rows);
			let query = "INSERT INTO Instructors VALUES ";
			if(courseObject.instructors.instructorName.length == 0){
				//DUMB QUERY TO NOT BREAK THE CALLBACK CHAIN
				query='SHOW VARIABLES LIKE "%version%"  ';
			} else {
				courseObject.instructors.instructorName.forEach(function(row) {
					query += `(${courseObject.courseCode}, '${row}'),`;
				});
			}
			//Delete the last comma to prevent SQL Error
			query = query.substring(0, query.length-1);
		    return connection.promise().query(query);
	    }).catch( err => {
			alert(err);
			console.log(err);
			return 0;
    	});

		return result;

	}

	editCourseHelperDB(courseCode){
	    //Create Course Objects
		var courseObjects = [];
		// Perform a query
		let $query = 'SELECT * FROM Courses';
		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
			for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				var Course = new CourseClass(currentRow["course_name"],currentRow["course_code"],currentRow["course_credit"],
			 	currentRow["course_ects"],currentRow["course_prerequisite"],currentRow["mandatory/elective"],
			 	currentRow["active/inactive"],currentRow["semester"],new Array(),new Array());
			 	courseObjects.push(Course);
			}

			//Get Instructors of current course
			$query = 'SELECT * FROM Instructors';
		    return connection.promise().query($query)
	    })
	    .then( ([rows,fields]) => {
			//Add them to the corresponding object
			rows.forEach(function(row) {
				courseObjects.forEach(function(Course) {
					if(row.course_code == Course.courseCode){
						Course.instructors.push(row.instructor_name);
					}
				});
			});

			//Get Instructors of current course
			$query = 'SELECT * FROM Assistants';
			return connection.promise().query($query)
	    })
	    .then( ([rows,fields]) => {
			//Add them to the corresponding object
			rows.forEach(function(row) {
				courseObjects.forEach(function(Course) {
					if(row.course_code == Course.courseCode){
						Course.assistants.push(row.assistant_name);
					}
				});
			});
			//Return completed Course object array
			return courseObjects
	    });

		return result;
	}

	editCourseDB(courseObject){
		//First delete old informations then add new infos
		console.log(courseObject);
		
		//This field is not mandatory
		if (courseObject.coursePrequirities == "") courseObject.coursePrequirities = 'null';
		
		let query = "DELETE FROM `Instructors` WHERE `course_code` = "+courseObject.courseCode;
		var result = connection.promise().query(query)
	    .then( ([rows,fields]) => {
			query = "DELETE FROM `Assistants` WHERE `course_code` = "+courseObject.courseCode;
		    return connection.promise().query(query);
	    }).then( ([rows,fields]) => {
			query = "UPDATE Courses SET ";
			query += `course_credit =  ${courseObject.courseCredit} , `;
			query += `course_ects =  ${courseObject.courseEcts} , `;
			query += `course_name =  '${courseObject.courseName}' , `;
			query += `course_prerequisite =  ${courseObject.coursePrequirities} , `;
			query += `\`mandatory/elective\` =  ${courseObject.mandatory} , `;
			query += `\`active/inactive\` =  ${courseObject.active} , `;
			query += `semester =  ${courseObject.semester} `;
			query += " WHERE `course_code` = "+courseObject.courseCode;
			console.log(query);
		    return connection.promise().query(query);
	    }).then( ([rows,fields]) => {

			let query = "INSERT INTO Assistants VALUES ";
			courseObject.assistants.assistantName.forEach(function(row) {
				query += `(${courseObject.courseCode}, '${row}'),`;
			});
			//Delete the last comma to prevent SQL Error
			query = query.substring(0, query.length-1);

			//if no rows found return 1
			console.log(courseObject.assistants.assistantName.length);
			if (courseObject.assistants.assistantName.length == 0) query = "SELECT version()";

		    return connection.promise().query(query);
	    }).then( ([rows,fields]) => {

			let query = "INSERT INTO Instructors VALUES ";
			courseObject.instructors.instructorName.forEach(function(row) {
				query += `(${courseObject.courseCode}, '${row}'),`;
			});
			//Delete the last comma to prevent SQL Error
			query = query.substring(0, query.length-1);

			//if no rows found return 1
			if (courseObject.instructors.instructorName.length == 0) query = "SELECT version()";

		    return connection.promise().query(query);
	    }).catch( err => {
			alert(err);
			console.log(err);
			return 0;
    	});

		return result;
	}

	selectCoursesForSemesterHelperDB(){
		//Create Course Objects
		var courseCodes = [];
		// Perform a query
		let $query = 'SELECT * FROM Courses';
		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
	    	for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				var code = currentRow["course_code"];
			 	courseCodes.push(code);
			}
			return courseCodes
		});
		return result;

	}

	selectCoursesForSemesterDB(course, semester){
		let query = "UPDATE Courses SET semester='";
   		query+= semester;
   		query+="' WHERE course_code='";
   		query+=course;
   		query+="';";
		console.log(query);

		var result = connection.promise().query(query)
	    .then( ([rows,fields]) => {
		    return connection.promise().query(query);
	    }).catch( err => {
			alert(err);
			console.log(err);
    	});

		return result;
	}

	deleteCourseHelperDB(){
		//Create Course Objects
		var courseCodes = [];
		// Perform a query
		let $query = 'SELECT * FROM Courses';
		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
	    	for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				var code = currentRow["course_code"];
			 	courseCodes.push(code);
			}
			return courseCodes
		});
		return result;

	}

	deleteCourseDB(course){
		//delete the course
		console.log(course);

		let query = "DELETE FROM `Instructors` WHERE `course_code` = "+course;

		var result = connection.promise().query(query)
	    .then( ([rows,fields]) => {
			query = "DELETE FROM `Assistants` WHERE `course_code` = "+course;
		    return connection.promise().query(query);
	    }).then( ([rows,fields]) => {
			query = "DELETE FROM `Schedule` WHERE `course_code` = "+course;
		    return connection.promise().query(query);
	    }).then( ([rows,fields]) => {
			query = "DELETE FROM `Courses` WHERE `course_code` = "+course;
		    return connection.promise().query(query);
	    });

		return result;
	}
	addEmailDB(EmailObject){
		// Perform a query

		let query = "INSERT INTO Email (`mailgroup`, `mail`) ";
		query += `VALUES ('${EmailObject.emailGroup}', '${EmailObject.emailName}')`;
		console.log(query);

		var result = connection.promise().query(query)
	    .then( ([rows,fields]) => {
		    return 1;
	    }).catch( err => {
			alert(err);
			console.log(err);
    	});

		return result;

	}
	setupWeeklyCourseScheduleHelperDB(){
		//Create Course Objects
		var courseCodes = [];
		// Perform a query
		let $query = 'SELECT * FROM Courses';
		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
	    	for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				var code = currentRow["course_code"];
			 	courseCodes.push(code);
			}
			return courseCodes
		});
		return result;
	}

	setupWeeklyCourseScheduleDB(schedule){
		let query = "INSERT INTO `Schedule`(`course_code`, `course_time`, `course_day`) VALUES (";
   		query+= schedule.courseCode;
   		query+=",";
   		query+=schedule.courseTime;
   		query+=",";
   		query+=schedule.courseDay;
   		query+=");";
		console.log(query);

		var result = connection.promise().query(query)
	    .then( ([rows,fields]) => {
		    return(1);
	    }).catch( err => {
			alert(err);
		    return(0);
			console.log(err);
    	});

		return result;
	}
	checkConflict(schedule){
		let query= "SELECT s.course_code, course_day, course_time FROM Courses c, Schedule s WHERE s.course_day = "
		query+= schedule.courseDay ;
		query+="  AND s.course_time = "
		query+=schedule.courseTime;
		query+="  AND (SELECT semester FROM Courses d WHERE "
		query+= schedule.courseCode;
		query+="  = d.course_code) =c.semester AND c.course_code = s.course_code;"
		console.log(query);
		var result = connection.promise().query(query)
	    .then( ([rows,fields]) => {
	    	console.log(rows);
		    return(rows);
	    }).catch( err => {
			//alert(err);
		    return(111);
			console.log(err);
    	});
	    return result;
	}

	showEmailsDB(){
	    //Create Email Objects
		var emailObjects = [];

		// Perform a query
		let $query = 'SELECT * FROM Email';
		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
			for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				var Email = new EmailClass(currentRow["mailgroup"],currentRow["mail"]);
			 	emailObjects.push(Email);
			}


			//Return completed Email object array
			return emailObjects
	    });

		return result;
	}


	importEmailListDB(){

	}


	editEmailHelperDB(mailgroup){
		//Create Course Objects
		var emails = [];
		// Perform a query
		let $query = "SELECT mail FROM `Email` WHERE mailgroup = " +  "'" + mailgroup + "'";

		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
	    	for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				var mail = currentRow["mail"];
			 	emails.push(mail);
			}
			return emails
		});
		return result;
	}


	editEmailDB(emailObject,oldmail){
	//First delete old informations then add new infos
	console.log(emailObject);
	console.log(oldmail);

	let query = "DELETE FROM `Email` WHERE `mail` = "+"'" +oldmail +"'";
	var result = connection.promise().query(query)
		.then( ([rows,fields]) => {
		query = "INSERT INTO Email (`mailgroup`, `mail`) ";
		query += `VALUES ('${emailObject.emailGroup}', '${emailObject.emailName}')`;
		console.log(query);
			return connection.promise().query(query);
		}).catch( err => {
		alert(err);
		console.log(err);
		});

	return result;

	}

	deleteEmailDB(mail){
		//delete the email
		console.log("DB Mail: " + mail);
		let $query = "DELETE FROM `Email` WHERE `mail` = '" + mail + "' ";
		console.log($query);

		var result = connection.promise().query($query).catch( err => {
			alert(err);
			console.log(err);
    	});

		return result;
	}

	deleteEmailHelperDB(){
		//Create Email Objects
		var emails = [];
		var currentEmail;
		// Perform a query
		let $query = 'SELECT * FROM Email';
		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
	    	for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				var group = currentRow["mailgroup"];
				var mail = currentRow["mail"];
				currentEmail = new EmailClass(group,mail);
			 	emails.push(currentEmail);
			}
			return emails
		});
		return result;
	}

	getEmailListDB(){

	}

	addContentManagerDB(username, password){

		let $query = "INSERT INTO Accounts (`username`, `password`, `account_type`) ";
			$query += `VALUES ('${username}', '${password}', 1)`;
			console.log($query);
	    var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
				return 1;
		}).catch( err => {
			alert(err);
			return 0;
			console.log(err);
    	});
			return result;
	}

	deleteContentManagerDB(delete_username){
		//delete the content manager from db
		console.log("this username was deleted : " + delete_username);
		let $query = "DELETE FROM `Accounts` WHERE `username` = '" + delete_username + "' ";
		var result = connection.promise().query($query).catch( err => {
			alert(err);
			console.log(err);
    	});

		return result;

	}

	deleteContentManagerHelperDB(){
		var usernames = [];
		// Perform a query
		let $query = 'SELECT * FROM Accounts';
		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
	    	for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				console.log(currentRow["username"])
				var currentUsername = currentRow["username"];
			 	usernames.push(currentUsername);
			}
			return usernames
		});
		return result;

	}

	getScheduleDB(semester){
	    //Create Course Objects
		var courseObjects = [];

		var modulo = 0
		// If semester is fall semester % 2 have to be 1
		if(semester == "fall") modulo = 1

		let $query = 'SELECT * FROM Courses WHERE ( semester % 2 ) = '+modulo;
		let subquery = 'SELECT course_code FROM Courses WHERE ( semester % 2 ) = '+modulo;
		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
			for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				var Course = new CourseClass(currentRow["course_name"],currentRow["course_code"],currentRow["course_credit"],
			 	currentRow["course_ects"],currentRow["course_prerequisite"],currentRow["mandatory/elective"],
			 	currentRow["active/inactive"],currentRow["semester"],new Array(),new Array());
			 	courseObjects.push(Course);
			}

			//Get Instructors of current course
			$query = 'SELECT * FROM Instructors WHERE course_code IN ('+subquery+')';
		    return connection.promise().query($query)
	    })
	    .then( ([rows,fields]) => {
			//Add them to the corresponding object
			rows.forEach(function(row) {
				courseObjects.forEach(function(Course) {
					if(row.course_code == Course.courseCode){
						Course.instructors.push(row.instructor_name);
					}
				});
			});

			//Get Instructors of current course
			$query = 'SELECT * FROM Assistants WHERE course_code IN ('+subquery+')';
			return connection.promise().query($query)
	    })
	    .then( ([rows,fields]) => {
			//Add them to the corresponding object
			rows.forEach(function(row) {
				courseObjects.forEach(function(Course) {
					if(row.course_code == Course.courseCode){
						Course.assistants.push(row.assistant_name);
					}
				});
			});

			//Get Schedules of current course
			$query = 'SELECT * FROM Schedule WHERE course_code IN ('+subquery+')';
			return connection.promise().query($query)
	    })
	    .then( ([rows,fields]) => {
			//Add them to the corresponding object
			rows.forEach(function(row) {
				courseObjects.forEach(function(Course) {
					if(row.course_code == Course.courseCode){
						var Schedule = new ScheduleClass(row.course_code,row.course_day,row.course_time);
						Course.schedule.push(Schedule);
					}
				});
			});

			//return course array
			return courseObjects
	    });


		return result;
	}

  sendEventDB(group){
    var emails = [];
		// Perform a query
		let $query = 'SELECT * FROM Email WHERE mailgroup = ' + "'" + group + "'";
		var result = connection.promise().query($query)
	    .then( ([rows,fields]) => {
	    	for (i = 0; i < rows.length; i++) {
				var currentRow = rows[i];
				var mail = currentRow["mail"];
			 	emails.push(mail);
			}
			return emails
		});
		return result;
  }


}
