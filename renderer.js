// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

let $ = jQuery = require('jquery');

module.exports = {
	addcontentmanager: function() {
		var data = $('form').serializeArray().reduce(function(obj, item) {
		    obj[item.name] = item.value;
		    return obj;
		}, {});
		alert(data["username"]);
	}
	
};
