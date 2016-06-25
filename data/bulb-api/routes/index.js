var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var appConfig = require('../config');
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
		res.status(500).json({error:true, message: appConfig.ERROR.not_created("User", err.message)});
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
		res.status(500).json({error:true, message: appConfig.ERROR.not_found("User", err.message)});
	});
})
.put( function(req, res, next){
	models.User.forge({id: req.params.id}).fetch()
	.then(function(user){
		user.save(
		{
			firstname: req.body.firstname || user.get('firstname'),
			lastname : req.body.lastname  || user.get('lastname'),
			email	 : req.body.email	  || user.get('email')
		}).then(function(){
		res.json({error: false, data: appConfig.SUCCESS.ok_updated("User")});
	});
	})
	.catch( function(err){
		console.log(err);
		res.status(500).json({error:true, message: appConfig.ERROR.not_updated("User", err.message)});
	});
})
.delete( function(req, res, next){
	models.User.forge({id: req.params.id}).fetch()
	.then(function(user){
		user.destroy().then(function(){
		res.json({error:false, data:appConfig.SUCCESS.ok_deleted("User")})
	});
	})
	.catch(function(err){
		console.log(err);
		res.status(500).json({error: true, message: appConfig.ERROR.not_deleted("User", err.message)});
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
		res.status(500).json({error:true, message: appConfig.ERROR.not_created("Asset", err.message)});
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
		res.status(500).json({error:true, message: appConfig.ERROR.not_found("Asset", err.message)});
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
		res.json({error: false, data:appConfig.SUCCESS.ok_updated("Asset")});
	});
	})
	.catch( function(err){
		console.log(err);
		res.status(500).json({error:true, message: appConfig.ERROR.not_updated("Asset", err.message)});
	});
})
.delete( function(req, res, next){
	models.Asset.forge({id: req.params.id}).fetch()
	.then(function(asset){
		asset.destroy().then(function(){
		res.json({error:false, data:appConfig.SUCCESS.ok_deleted("Asset")})
	});
	})
	.catch(function(err){
		console.log(err);
		res.status(500).json({error: true, message: appConfig.ERROR.not_deleted("Asset", err.message)});
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
	// ARBITRARY ASSUMPTION :   dateTime objects represent a "positive" time interval
	// 							that is begin < end.
	//							This assumption is made upon the idea that in a real-life app the db
	//							will be validated.
	//							
	//
	//            X---------------Y					current "wannabe" allocation
	//                     A-----------B			existing allocation overlapping from right
	//         A------B 							existing allocation overlapping from left
	//                    A---B 					existing allocation is a subset of "wannabe"
	//
	// Given two date ranges, the simplest way to determine whether the two date ranges overlap is
	// (X <= B ) &&  (Y >= A)
	//
	// X = begins of this allocation
	// Y = ends   of this allocation
	// A = begins of db data
	// B = ends   of db data

	// proof
	// XY and AB do not overlap if 
	// (a)		XY is completely after  AB  --> ( X > B) --> not(a) == (X<B)
	// (b)		XY is completely before AB  --> ( Y < A) --> not(b) == (Y>A)
	//
	// XY and AB overlap if not( a or b )
	// by using De Morgan law it can be shown that
	// not(a or b) === not(a) and not(b)

	var begins, ends;

	if( req.body.begins !== undefined && req.body.ends!== undefined){
		begins = new Date( req.body.begins );
		ends   = new Date( req.body.ends   );
	}else{
		res.status(500).json({
			error:true, 
			message:appConfig.ERROR.not_created("Allocation", "Please provide begins/ends value for this entry."),
			data: {begins: req.body.begins, ends: req.body.ends}
		});
	}

	if ( ends < begins ){
		res.status(500).json({
			error:true, 
			message:appConfig.ERROR.not_created("Allocation", "Invalid begin/end. Begin must be < end.")
		});
	}

	new models.User().where({id: req.body.userId}).fetch()
	.then(function(user){
		new models.Asset().where({id: req.body.assetId}).fetch()
		.then(function(asset){
			new models.Allocation().where({asset_id: asset.get('id')})
			.where("ends", ">=", begins)
			.where("begins", "<=", ends)
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
							mesage: appConfig.ERROR.not_created("Allocation", err.message),
							allocations:allocation.toJSON()
						}
					});
				}
			}).catch(function(err){ res.status(500).json({error:true, message:err.message});}); 
		}).catch(function(err){ res.status(500).json({error:true, message:appConfig.ERROR.not_found("Asset", err.message)});}); // ASSET NOT FOUND
	}).catch(function(err){ res.status(500).json({error:true, message:appConfig.ERROR.not_found("", err.message)});}); // USER NOT FOUND
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
	var begins = null;
	var ends   = null;

	req.body.begins && (begins = new Date( req.body.begins ));
	req.body.ends   && (ends   = new Date( req.body.ends   ));

	console.log( "begins :" + begins);
	console.log( "ends :" + ends);

	if ( begins && ends && ends < begins ){
		res.status(500).json({
			error:true, 
			message:appConfig.ERROR.not_updated("Allocation", "Invalid begin/end. Begin must be < end."),
			data:{begins: begins, ends:ends}
		});
	}

	new models.Allocation().where({id: req.params.id})
	.fetch()
	.then(function(currentAllocation){
		console.log( "Current allocation found.\n");
		console.log( currentAllocation );
		new models.User().where({id: req.body.user_id || currentAllocation.get('user_id')}).fetch()
		.then(function(user){
			console.log("User found.");
			console.log(user);
			new models.Asset().where({id: req.body.asset_id || currentAllocation.get('asset_id')}).fetch()
			.then(function(asset){
				console.log("Asset Found");
///////////////////////////////////////////////////////////////////////////////////////////////////////////
				new models.Allocation()
				.where({asset_id: asset.get('id')})
				.where("id","<>", req.params.id)
				.where("ends", ">=", begins || currentAllocation.get('begins'))
				.where("begins", "<=", ends || currentAllocation.get('ends'))
				.fetchAll()
				.then( function(allocation){
					console.log("allocation.length=%d", allocation.length);
					if( allocation.length === 0){
						console.log("Attempting to save updated allocation");
						currentAllocation.save({
							name: req.body.name || currentAllocation.get('name'),
							begins: begins || currentAllocation.get('begins'),
							ends: ends || currentAllocation.get('ends'),
							user_id: user.get('id'),
							asset_id: asset.get('id')
						})
						.then(function(allocation){res.json({error:false, id: allocation.get('id')})})
						.catch(function(err){res.status(500).json({error:true, message:err.message});})
					}else{
						res.json({
							error:true, 
							data:{
								mesage: appConfig.ERROR.not_created("Allocation", "Could not create allocation because overlaps with other."),
								allocations:allocation.toJSON()
							}
						});
					}
				}).catch(function(err){ res.status(500).json({error:true, message:err.message});}); 
///////////////////////////////////////////////////////////////////////////////////////////////////////////
			})
			.catch(function(err){
				res.status(500).json({
					error:true, 
					message:appConfig.ERROR.not_updated("Allocation", err.message),
					data:{id: req.params.user_id}
				});
			});
		})
		.catch(function(err){
			res.status(500).json({
				error:true, 
				message:appConfig.ERROR.not_updated("Allocation", err.message),
				data:{id: req.params.user_id}
			});
		});
	})
	.catch(function(err){
		res.status(500).json({
			error:true, 
			message:appConfig.ERROR.not_updated("Allocation", err.message),
			data:{id: req.params.id}
		});
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
