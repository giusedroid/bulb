var config = {};

var DB = {
	client: 'postgresql',
	connection:{
		host: 'localhost',
		port: '5432',
		user: 'bulb',
		password: 'bulb',
		database: 'bulb_db',
		charset: 'utf8'
	}
};

DB.connectionString = 	"postgres://" + DB.connection.user + ":" +DB.connection.password + "@" 
						+ DB.connection.host + ":" + DB.connection.port +"/"+ DB.connection.database;

config.DB = DB;

var ERROR = {
	NO_API_KEY				: "API key not allowed.",
	not_found 				: function( what, message ){ return what + " could not be found.  \n Error: " + message;},
	not_updated 			: function( what, message ){ return what + " could not be updated.\n Error: " + message;},
	not_deleted				: function( what, message ){ return what + " could not be deleted.\n Error: " + message;},
	not_created				: function( what, message ){ return what + " could not be created.\n Error: " + message;}
}

config.ERROR = ERROR;

var SUCCESS = {
	ok_created				: function( what ){ return what + " successfully created." },
	ok_updated				: function( what ){ return what + " successfully updated." },
	ok_deleted				: function( what ){ return what + " successfully deleted." }
}

config.SUCCESS = SUCCESS;

module.exports = config;