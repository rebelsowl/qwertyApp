// All button clicks with gui handled here

let $ = jQuery = require('jquery');

module.exports = {
	showCourses: function() {
		user.showCourses();
	}
	
	addcontentmanager: function() {
		var data = $('form').serializeArray().reduce(function(obj, item) {
		    obj[item.name] = item.value;
		    return obj;
		}, {});
		alert(data["username"]);
	}
	
};
