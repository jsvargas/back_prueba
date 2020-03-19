const jwt = require('jsonwebtoken');
const path = require('path');
const logger = require('../config/logger')(path.basename(__filename, '.js'));


exports.auth_normal = function(req, res, next) {
    console.log("normal_auth");
    next();
};


exports.auth_admin = function(req, res, next) {
    console.log("admin auth");
    next();
};

exports.auth_tesoreria = function(req, res, next) {
    console.log("auth_tesoreria");
    next();
}