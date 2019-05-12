// All button clicks with gui handled here

function showCoursesClicked() {
	user.showCourses();
}

function addcontentmanager() {
	var data = $('form').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	alert(data["username"]);
}
