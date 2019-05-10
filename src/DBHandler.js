
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


	
}
