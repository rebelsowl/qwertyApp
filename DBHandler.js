
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
		
	    var res = connection.promise().query($query)
	    .then( ([rows,fields]) => {
			if (rows.length == 1){
				return rows[0]["account_type"];
			} else  {
				return 3;
			}
				
	    })
	    .catch(console.log);
		
		return res;
				
	}


	
}
