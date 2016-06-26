var specConfig = {};

specConfig.API ={
	url : "http://localhost:3000/api",
	apikey : "mellon",
	authFail : {message: "YOU SHALL NOT PASS"}
};

specConfig.API.getAuthString  = function () { return "?apikey=" + this.apikey; };
module.exports = specConfig;
