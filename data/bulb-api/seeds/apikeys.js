var Promise = require('bluebird');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('apikeys').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('apikeys').insert({uid: 1, key: 'bulb-ok_pass1'}),
        knex('apikeys').insert({uid: 2, key: 'bulb-ok_pass2'}),
        knex('apikeys').insert({uid: 3, key: 'bulb-ok_pass3'})
      ]);
    });
};
