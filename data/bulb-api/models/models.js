var bookshelf = require('../db');

var ApiKey = bookshelf.Model.extend({
	tableName: 'apikeys'
});

var User = bookshelf.Model.extend({
	tableName: 'users',
	allocations: function(){
		return this.hasMany(Allocation);
	}
});

var Asset = bookshelf.Model.extend({
	tableName: 'assets',
	allocations: function(){
		return this.hasMany(Allocation);
	}
});

var Allocation = bookshelf.Model.extend({
	tableName: 'allocations',
	user: function(){
		return this.belongsTo(User);
	},
	asset: function(){
		return this.belongsTo(Asset);
	}
});

module.exports = {
	ApiKey : ApiKey,
	User: User,
	Asset: Asset,
	Allocation: Allocation
}