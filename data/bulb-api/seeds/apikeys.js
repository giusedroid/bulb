var Promise = require('bluebird');
var models = require('../models/models');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('apikeys').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        models.ApiKey.forge({key:'mellon'}).save()
      ]);
    });
};
