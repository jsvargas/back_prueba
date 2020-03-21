const jwt = require('jsonwebtoken');
const path = require('path');
const logger = require('../config/logger')(path.basename(__filename, '.js'));


//Valida que el usuario esté autenticado con un JWT válido
exports.auth_normal = function(req, res, next) {
    console.log("normal_auth");
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (e) {
        logger.error(e);
        return res.status(401).json({
            error: 401,
            messageError: 'Auth failed'
        });
    }
};

//Valida que el usuario esté autenticado con un JWT válido y que sea administrador
exports.auth_admin = function(req, res, next) {
    console.log("admin auth");
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        if (req.userData.type == 1){
            console.log(req.userData)
            next();
        }
        else{
            return res.status(403).json({
                error: 403,
                messageError: 'Sin privilegios failed'
            });
        }

    } catch (e) {
        logger.error(e);
        return res.status(401).json({
            error: 401,
            messageError: 'Auth failed'
        });
    }
};
