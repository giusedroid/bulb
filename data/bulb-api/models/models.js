var bookshelf = require('../db');

var ApiKey = bookshelf.Model.extend({
	tableName: 'apikeys'
});

var User = bookshelf.Model.extend({
	tableName: 'users',
	allocations: function(){
		return this.belongsToMany(Allocation);
	}
});

var Asset = bookshelf.Model.extend({
	tableName: 'assets',
	allocations: function(){
		return this.belongsToMany(Allocation);
	}
});

var Allocation = bookshelf.Model.extend({
	tableName: 'allocations',
	users: function(){
		return this.hasOne(User);
	},
	assets: function(){
		return this.hasOne(Asset);
	}
});

module.exports = {
	ApiKey : ApiKey,
	User: User,
	Asset: Asset,
	Allocation: Allocation
}