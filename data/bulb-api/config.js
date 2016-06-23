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

module.exports = config;