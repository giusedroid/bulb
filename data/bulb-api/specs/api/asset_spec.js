var frisby = require('frisby');
var specConfig = require("../specConfig");


frisby.create('GET Asset not authenticated')
.get( specConfig.API.url + "/asset")
.expectStatus(200)
.expectHeaderContains('content-type', 'application/json')
.expectJSON( specConfig.API.authFail)
.toss();

frisby.create('GET Asset authenticated')
.get( specConfig.API.url +"/asset" + specConfig.API.getAuthString() )
.expectStatus(200)
.expectHeaderContains('content-type', 'application/json')
.expectJSONTypes(0, {
	id: Number,
	firstname: String,
	lastname: String,
	email: String
})
.toss();

frisby.create("POST Asset not authenticated")
.post(specConfig.API.url + "/asset", {
	name 		: "FRISBY",
	type  		: "TEST",
	attributes	: {attribute:"test"}
})
.expectStatus(302)
.toss();

frisby.create("POST Asset authenticated")
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
.afterJSON(function(res){

	frisby.create('GET Asset authenticated')
	.get( specConfig.API.url + "/asset/" +res.id + specConfig.API.getAuthString() )
	.expectStatus(200)
	.expectHeaderContains('content-type', 'application/json')
	.expectJSONTypes({
		id: Number,
		name: String,
		type: String,
		attributes: Object
	}).afterJSON(function(){
		frisby.create("PUT Asset authenticated")
		.put( specConfig.API.url + "/asset/" + res.id + specConfig.API.getAuthString(), {
			name 		: "FRISBY",
			type  		: "TEST2",
			attributes	: {attribute:"test"}
		})
		.expectStatus(200)
		.expectJSONTypes({
			error: Boolean,
			data : String
		})
		.afterJSON(function(){
			frisby.create("DELETE Asset authenticated")
			.delete( specConfig.API.url + "/asset/" + res.id + specConfig.API.getAuthString())
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

})
.toss();


/*
*/