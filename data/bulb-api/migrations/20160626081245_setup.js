var Promise = require('bluebird');

exports.up = function(knex, Promise) {
  return Promise.all([
  		knex.schema.createTable('apikeys', function(table){
  			table.increments('id').primary();
  			table.string('key');
  		}),

  		knex.schema.createTable('users', function(table){
  			table.increments('id').primary();
  			table.string('firstname');
  			table.string('lastname');
  			table.string('email');
  		}),

  		knex.schema.createTable('assets', function(table){
  			table.increments('id').primary();
  			table.string('name');
  			table.string('type');
  			table.json('attributes').nullable();

  		}),

  		knex.schema.createTable('allocations', function(table){
  			table.increments('id').primary();
  			table.string('name');
  			table.dateTime('begins');
  			table.dateTime('ends');
  			table.integer('user_id').references('users.id');
  			table.integer('asset_id').references('assets.id');
  		})
  	]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.dropTable('users'),
  	knex.schema.dropTable('assets'),
  	knex.schema.dropTable('allocations'),
  	knex.schema.dropTable('apikeys')
  	]);
};
