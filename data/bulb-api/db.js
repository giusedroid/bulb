var dbConfig = require('./knexfile');
var env = 'development';
var knex = require('knex')(dbConfig[env]);

module.exports = knex;

knex.migrate.latest([dbConfig]);