//DBHandler object
var DBHandlerClass = require('./DBHandler.js');
var DBHandler = new DBHandlerClass();

//ContentManager Object
var ContentManager = require('./ContentManager.js');

module.exports = class WebAdmin extends ContentManager{
	constructor(username){
		super(username);
	}
	
	
}
