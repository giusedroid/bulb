var Promise = require('bluebird');

exports.up = function(knex, Promise) {
  return Promise.all([
  		knex.schema.createTable('api-keys', function(table){
  			table.increments('uid').primary();
  			table.string('key');
  		});

  		knex.schema.createTable('users', function(table){
  			table.increments('id').primary();
  			table.string('firstname');
  			table.string('lastname');
  			table.string('email');
  		});

  		knex.schema.createTable('assets', function(table){
  			table.increments('id').primary();
  			table.string('name');
  			table.string('type');
  			table.json('attributes').nullable();

  		});

  		knex.schema.createTable('allocations', function(table){
  			table.increments('id').primary();
  			table.string('name');
  			table.dateTime('begins');
  			table.dateTime('ends');
  			table.integer('user_id')
  				 .references('uid')
  				 .inTable('users')
  			table.integer('asset_id')
  				 .references('id')
  				 .inTable('assets')
  		});
  	]);
};

exports.down = function(knex, Promise) {
  
};
