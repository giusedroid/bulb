
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({id: 1, firstname: 'Jack', lastname: 'Black', email: 'jack@tenacio.us'}),
        knex('users').insert({id: 2, firstname: 'Kyle', lastname: 'Gass', email: 'kg@tenacio.us'}),
        knex('users').insert({id: 3, firstname: 'The', lastname: 'Devil', email: 'beelzeboss@tenacio.us'})
      ]);
    });
};
