
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({firstname: 'Jack', lastname: 'Black', email: 'jack@tenacio.us'}),
        knex('users').insert({firstname: 'Kyle', lastname: 'Gass', email: 'kg@tenacio.us'}),
        knex('users').insert({firstname: 'The', lastname: 'Devil', email: 'beelzeboss@tenacio.us'})
      ]);
    });
};
