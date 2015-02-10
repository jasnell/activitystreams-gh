var config  = require('./config.json');

// ********** LDP ********** //

exports.listenHost = process.env.VCAP_APP_HOST || config.host;
exports.listenPort = process.env.VCAP_APP_PORT || config.port;

exports.secret = config.secret;
exports.cloudant = config.cloudant;
