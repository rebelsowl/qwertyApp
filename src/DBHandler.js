
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
			courseObject.instructors.instructorName.forEach(function(row) {
				query += `(${courseObject.courseCode}, '${row}'),`;
			});
			//Delete the last comma to prevent SQL Error
			query = query.substring(0, query.length-1);
		    return connection.promise().query(query);
	    }).catch( err => {
			alert(err);
			console.log(err);
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
		
		let query = "DELETE FROM `Instructors` WHERE `course_code` = "+courseObject.courseCode;
		
		var result = connection.promise().query(query)
	    .then( ([rows,fields]) => {
			query = "DELETE FROM `Assistants` WHERE `course_code` = "+courseObject.courseCode;
		    return connection.promise().query(query);
	    }).then( ([rows,fields]) => {
			query = "DELETE FROM `Courses` WHERE `course_code` = "+courseObject.courseCode;
		    return connection.promise().query(query);
	    }).then( ([rows,fields]) => {
			query = "INSERT INTO Courses (`course_code`, `course_credit`, `course_ects`, `course_name`, `course_prerequisite`, `mandatory/elective`, `active/inactive`, `semester`) ";
			query += `VALUES (${courseObject.courseCode}, ${courseObject.courseCredit}, ${courseObject.courseEcts}, '${courseObject.courseName}', ${courseObject.coursePrequirities}, ${courseObject.mandatory}, ${courseObject.active}, ${courseObject.semester})`;
		    return connection.promise().query(query);
	    }).then( ([rows,fields]) => {
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
			courseObject.instructors.instructorName.forEach(function(row) {
				query += `(${courseObject.courseCode}, '${row}'),`;
			});
			//Delete the last comma to prevent SQL Error
			query = query.substring(0, query.length-1);
		    return connection.promise().query(query);
	    }).catch( err => {
			alert(err);
			console.log(err);
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
		let query = "INSERT INTO `Schedule`(`course_code`, `course_day`, `course_time`) VALUES (";
   		query+= schedule.courseCode;
   		query+=",";
   		query+=schedule.courdeDay;
   		query+="',";
   		query+=schedule.courseTime;
   		query+=");";
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












}

