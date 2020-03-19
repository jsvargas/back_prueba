//require express
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const checkAuth = require('../middleware/check-auth')
const controller = require('../controllers/controller');
const path = require('path');
const logger = require('../config/logger')(path.basename(__filename, '.js'));

const router = express.Router();
var cors = require('cors');
module.exports = router;



//Uso de bodyparser para manejar el envío
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json({
    limit: '5mb'
}));

router.use(cors());

router.post('/login', controller.login);

router.post('/register', controller.register);

router.get('/getUsers', checkAuth.auth_admin, controller.getUsers);

router.post('/editUser', checkAuth.auth_admin, controller.editUser);

router.post('/deleteUser', checkAuth.auth_admin, controller.editUser);

router.get('/getBooks', checkAuth.auth_normal, controller.getBooks);

router.get('/getBooksFull', checkAuth.auth_admin, controller.getBooksFull);

router.post('/addBook', checkAuth.auth_admin, controller.addBook);

router.post('/editBook', checkAuth.auth_admin, controller.addBook);

router.post('/reserveBook', checkAuth.auth_normal, controller.reserveBook);