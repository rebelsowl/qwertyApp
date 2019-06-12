
module.exports = class Course {
	constructor(courseName,courseCode,courseCredit,courseEcts,coursePrequirities,mandatory,active,semester,instructors,assistants){
		this.courseName=courseName;
		this.courseCode=courseCode;
		this.courseCredit=courseCredit;
		this.courseEcts=courseEcts;
		this.coursePrequirities=coursePrequirities;
		this.mandatory=mandatory;
		this.active=active;
		this.semester=semester;
		this.instructors=instructors;
		this.assistants=assistants;
		this.schedule=new Array();
	}
	
}
