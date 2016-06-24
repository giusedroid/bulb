var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

var models = require('../models/models');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*******************************************************/
//	CRUD for user 										/
/*******************************************************/

// [R] GET  [user]
// [C] POST user
router.route('/api/user')
.get(function(req, res, next){
	new models.User().fetchAll().then(function(users){
		res.json({error:false, data:users.toJSON()})
	}).catch(function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});
})
.post( function(req, res, next){
	models.User.forge({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email
	})
	.save()
	.then(function( user ){
		res.json({error:false, id: user.get('id')})
	})
	.catch(function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});
});

// [R] GET user
// [U] PUT user
// [D] DELETE user
router.route('/api/user/:id')
.get(function(req, res, next){
	new models.User().where({id:req.params.id}).fetch().then(function(users){
		res.send(users.toJSON());
	}).catch(function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});
})
.put( function(req, res, next){
	models.User.forge({id: req.params.id}).fetch()
	.then(function(user){
		user.save(
		{
			firstname: req.body.firstname || user.get('firstname'),
			lastname : req.body.lastname  || user.get('lastname'),
			email	 : req.body.email		|| user.get('email')
		}).then(function(){
		res.json({error: false, data:"User successfully updated."});
	});
	})
	.catch( function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});
})
.delete( function(req, res, next){
	models.User.forge({id: req.params.id}).fetch()
	.then(function(user){
		user.destroy().then(function(){
		res.json({error:false, data:"User successfully deleted."})
	});
	})
	.catch(function(err){
		console.log(err);
		res.status(500).json({error: true, message: err.message});
	});
});


/*******************************************************/
//	CRUD for asset 										/
/*******************************************************/

// [R] GET  [asset]
// [C] POST asset
router.route('/api/asset')
.get(function(req, res, next){
	new models.Asset().fetchAll().then(function(assets){
		res.json({error:false, data:assets.toJSON()})
	}).catch(function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});
})
.post( function(req, res, next){
	models.Asset.forge({
		name: req.body.name,
		type: req.body.type,
		attributes: req.body.attributes
	})
	.save()
	.then(function( asset ){
		res.json({error:false, id: asset.get('id')});
	})
	.catch(function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});
});

// [R] GET asset
// [U] PUT asset
// [D] DELETE asset
router.route('/api/asset/:id')
.get(function(req, res, next){
	new models.Asset().where({id:req.params.id}).fetch().then(function(assets){
		res.send(assets.toJSON());
	}).catch(function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});
})
.put( function(req, res, next){
	models.Asset.forge({id: req.params.id}).fetch()
	.then(function(asset){
		asset.save(
		{
			name: req.body.name || asset.get('name'),
			type : req.body.type  || asset.get('type'),
			attributes: req.body.attributes || asset.get('attributes')
		}).then(function(){
		res.json({error: false, data:"Asset successfully updated."});
	});
	})
	.catch( function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});
})
.delete( function(req, res, next){
	models.Asset.forge({id: req.params.id}).fetch()
	.then(function(asset){
		asset.destroy().then(function(){
		res.json({error:false, data:"Asset successfully deleted."})
	});
	})
	.catch(function(err){
		console.log(err);
		res.status(500).json({error: true, message: err.message});
	});
});


/*******************************************************/
//	CRUD for allocation 								/
/*******************************************************/

// [R] GET  [allocation]
// [C] POST allocation
router.route('/api/allocation')
.get(function(req, res, next){
	new models.Allocation().fetchAll().then(function(allocations){
		res.json({error:false, data:allocations.toJSON()})
	}).catch(function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});
})
.post( function(req, res, next){
	var begins = new Date( req.body.begins);
	var ends   = new Date( req.body.ends);

	new models.User().where({id: req.body.userId}).fetch()
	.then(function(user){
		new models.Asset().where({id: req.body.assetId}).fetch()
		.then(function(asset){
			new models.Allocation().where({asset_id: asset.get('id')})
			.where(begins, "<=", "ends")
			.where(ends,   ">=", "begins")
			.fetchAll()
			.then( function(allocation){
				if( allocation.length === 0){
					models.Allocation.forge({
						name: req.body.name,
						begins: begins,
						ends: ends,
						user_id: asset.get('id'),
						asset_id: asset.get('id')
					}).save()
					.then(function(allocation){res.json({error:false, id: allocation.get('id')})})
					.catch(function(err){res.status(500).json({error:true, message:err.message});})
				}else{
					res.json({
						error:true, 
						data:{
							mesage:"Could not create allocation because it overlaps with other.",
							allocations:allocation.toJSON()
						}
					});
				}
			}).catch(function(err){ res.status(500).json({error:true, message:err.message});});
		}).catch(function(err){ res.status(500).json({error:true, message:err.message});});
	}).catch(function(err){ res.status(500).json({error:true, message:err.message});});
});

// [R] GET allocation
// [U] PUT allocation
// [D] DELETE allocation
router.route('/api/allocation/:id')
.get(function(req, res, next){
	new models.Allocation().where({id:req.params.id}).fetch().then(function(allocations){
		res.send(allocations.toJSON());
	}).catch(function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});
})
.put( function(req, res, next){
	var user  = new models.User().where({id:req.params.id}).fetch().then(function(user){
		return user.toJSON();
	}).catch(function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});

	var asset = new models.Asset().where({id:req.params.id}).fetch().then(function(asset){
		return asset.toJSON();
	}).catch(function(err){
		console.log(err);
		res.status(500).json({error:true, message: err.message});
	});




})
.delete( function(req, res, next){
	models.Allocation.forge({id: req.params.id}).fetch()
	.then(function(allocation){
		allocation.destroy().then(function(){
		res.json({error:false, data:"Allocation successfully deleted."})
	});
	})
	.catch(function(err){
		console.log(err);
		res.status(500).json({error: true, message: err.message});
	});
});


router.get("/provaWhere", function(req, res, next){
	new models.Asset().where("id", ">=", "6").where("id", "<=","8").fetchAll()
	.then(function(all){
		res.json(all.toJSON());
	})
	.catch( function(err){
		console.log(err);
		res.status(500).json({error: true, message: err.message});
	});
})
module.exports = router;
