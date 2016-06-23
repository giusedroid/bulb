// Update with your config settings.
var appConfig = require('./config');

module.exports = {

  development: appConfig.DB,
    pool: {
      min: 2,
      max: 10
    }

 };

