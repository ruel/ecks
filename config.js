/*
 * config.js
 */

var config = require('nconf');
var winston = require('winston');
var fs = require('fs');

// Configuration
config.argv().env();

var node_env = config.get('NODE_ENV') || 'dev';

if (node_env === 'prod' || node_env === 'production') {
    file = 'config.prod.json';
} else if (node_env === 'dev' || node_env === 'development') {
    file = 'config.dev.json';
} else {
    file = 'config.' + node_env + '.json';
}

try {
    fs.statSync(file);
    config.file({ file : file });
} catch (error) {
    console.log("Unable to read configuration file: " + file);
    process.exit();
}

// Logging
var logger = {};

// Implement a custom logging, and include a timestamp
// 0 - info
// 1 - warning
// 2 - error
var levels = ['info', 'warn', 'error'];

logger.log = function(num, message) {
    
    // Add timestamp
    message = (new Date()).toString() + ' - ' + message;
    winston.log(levels[num], message);
}

module.exports = config;
module.exports.logger = logger;