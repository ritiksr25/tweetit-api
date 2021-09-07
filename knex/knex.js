const { AppConfig } = require('../config/app.config');
const environment = AppConfig.NODE_ENV || 'development';
const config = require('../knexfile.js')[environment];
module.exports = require('knex')(config);
