
//Mysql LIB
var mysql = require('mysql2');
var util = require('util');

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

module.exports = class DBHandler {


	 loginDB(username,password){
		// Perform a query
		let result;
		let $query = 'SELECT * FROM Accounts WHERE username = "'+username+'" AND password = "'+password+'"';
		const ipc = require('electron').ipcRenderer;
		
		connection.query($query, function(err, rows, fields, result) {
		    if (err){
		        console.log("An error ocurred performing the query.");
		        console.log(err);
		    } else {
				
			    if (rows.length == 0){
					console.log("3");
					alert("HATA");
			    } else {
                   ipc.sendSync('entry-accepted', 'ping')
			    }
		    }
		});
		
	}


	
}
