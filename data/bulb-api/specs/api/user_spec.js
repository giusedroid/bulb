var frisby = require('frisby');
var specConfig = require("../specConfig");
var retrievedData = {};


frisby.create('GET Users not authenticated')
.get( specConfig.API.url + "/user")
.expectStatus(200)
.expectHeaderContains('content-type', 'application/json')
.expectJSON( specConfig.API.authFail)
.toss();

frisby.create('GET Users authenticated')
.get( specConfig.API.url +"/user" + specConfig.API.getAuthString() )
.expectStatus(200)
.expectHeaderContains('content-type', 'application/json')
.expectJSONTypes(0, {
	id: Number,
	firstname: String,
	lastname: String,
	email: String
})
.toss();

frisby.create('GET User authenticated')
.get( specConfig.API.url + "/user/1" + specConfig.API.getAuthString() )
.expectStatus(200)
.expectHeaderContains('content-type', 'application/json')
.expectJSONTypes({
	id: Number,
	firstname: String,
	lastname: String
})
.toss();

frisby.create("POST User not authenticated")
.post(specConfig.API.url + "/user", {
	firstname : "FRISBY",
	lastname  : "TEST",
	email	  : "EMAIL"
})
.expectStatus(302)
.toss();

frisby.create("POST User authenticated")
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
.afterJSON(function(res){
	console.log("retrieved id " + res.id );
	frisby.create("PUT User authenticated")
	.put( specConfig.API.url + "/user/" + res.id + specConfig.API.getAuthString(), {
		firstname : "FRISBY_EDIT",
		lastname  : "TEST_EDIT",
		email	  : "EMAIL_EDIT"
	})
	.expectStatus(200)
	.expectJSONTypes({
		error: Boolean,
		data : String
	})
	.afterJSON(function(){
		frisby.create("DELETE User authenticated")
		.delete( specConfig.API.url + "/user/" + res.id + specConfig.API.getAuthString())
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


/*
*/