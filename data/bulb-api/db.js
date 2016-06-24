var dbConfig = require('./knexfile');
var env = 'development';
var knex = require('knex')(dbConfig[env]);


module.exports = require('bookshelf')(knex);

//knex.migrate.latest([dbConfig]);
