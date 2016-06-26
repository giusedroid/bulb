var frisby = require('frisby');
var specConfig = require("../specConfig");


frisby.create('GET Allocations not authenticated')
.get( specConfig.API.url + "/allocation")
.expectStatus(200)
.expectHeaderContains('content-type', 'application/json')
.expectJSON( specConfig.API.authFail)
.toss();

frisby.create('GET Allocations authenticated')
.get( specConfig.API.url +"/allocation" + specConfig.API.getAuthString() )
.expectStatus(200)
.expectHeaderContains('content-type', 'application/json')
.expectJSONTypes(0, {
	id: Number,
	firstname: String,
	lastname: String,
	email: String
})
.toss();

frisby.create("POST Allocation not authenticated")
.post(specConfig.API.url + "/allocation", {
	name : "FRISBY",
	begins  : new Date(),
	ends	: new Date(),
	userId  : 1,
	assetId : 1
})
.expectStatus(302)
.toss();

frisby.create("support User")
.post( specConfig.API.url + "/user" + specConfig.API.getAuthString(), {
	firstname : "FRISBY",
	lastname  : "TEST",
	email	  : "EMAIL",
})
.expectStatus(200)
.expectJSONTypes({
	error: Boolean,
	id   : Number
})
.afterJSON(function(user){
	frisby.create("support Asset")
	.post( specConfig.API.url + "/asset" + specConfig.API.getAuthString(), {
		name 		: "FRISBY",
		type  		: "TEST",
		attributes	: {attribute:"test"}
	})
	.expectStatus(200)
	.expectJSONTypes({
		error: Boolean,
		id   : Number
	})
	.afterJSON(function(asset){
		var now = new Date();
		var tom = new Date(new Date().setDate( now.getDate() +1));
		frisby.create("POST Allocation authenticated")
		.post( specConfig.API.url + "/allocation" + specConfig.API.getAuthString(), {
			name:"FRISBY",
			begins: now,
			ends: 	tom,
			userId: user.id,
			assetId: asset.id
		})
		.expectStatus(200)
		.expectJSONTypes({
			error: Boolean,
			id   : Number
		})
		.afterJSON(function(allocation){
			frisby.create('GET Allocation authenticated')
			.get( specConfig.API.url + "/allocation/" +allocation.id + specConfig.API.getAuthString() )
			.expectStatus(200)
			.expectHeaderContains('content-type', 'application/json')
			.expectJSONTypes({
				id: Number,
				begins: String,
				ends: String,
				user_id: Number,
				asset_id: Number,
				user: Object,
				asset:Object
			}).afterJSON(function(){
					frisby.create("DELETE Allocation authenticated")
					.delete( specConfig.API.url + "/allocation/" + allocation.id + specConfig.API.getAuthString())
					.expectStatus(200)
					.expectJSONTypes({
						error: Boolean,
						data : String
					})
					.toss();
			})
			.toss();
		})
		.toss();

	}).toss();
})
.toss();


