var randomAttributes = function(){
  return {
    hp: parseInt(Math.random()*500, 10),
    someValue: parseInt( Math.random() * 100, 10),
    someOther: ["yes", "no", "maybe", "call me", "epic powerness"][parseInt(Math.random()*4, 10)]
    }
}
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('assets').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('assets').insert({id: 1, name: 'Pick of Destiny', type:'Epic', attributes: JSON.stringify(randomAttributes())}),
        knex('assets').insert({id: 2, name: 'Banana of Doom', type:'Nerd', attributes:JSON.stringify(randomAttributes())}),
        knex('assets').insert({id: 3, name: 'Helm of Randomness', type:'Weapon', attributes:JSON.stringify(randomAttributes())})
      ]);
    });
};
