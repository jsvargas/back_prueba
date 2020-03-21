const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let fs = require('fs');
let path = require('path');
let logger = require('../config/logger')(path.basename(__filename, '.js'));
const db = require('../db/db')
require('dotenv').config();

exports.login = function(req, res) {
    console.log("1");
    if (!req.body || !req.body.password || !req.body.username) {
        logger.error("Bad request");
        return res.status(400).send({ "errorCode": "400", "errorMessage": "Bad request" });
    }
    const query = {
        name: 'login-user',
        text: 'SELECT * FROM users WHERE username = $1',
        values: [req.body.username]
    }
    db.query(query, (err, rows) => {
        if (err || rows.length == 0) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("User fetched");
        let user = rows.rows[0];
        console.log(user)
        if (!user){
            return res.status(401).send({ "errorCode": "5", "errorMessage": "Autenticación fallida" });
        }
        bcrypt.compare(req.body.password, user.password, (errb, result) => {
            if (errb) {
                logger.error("Bcrypt error :" + errb.toString());
                return res.status(500).send({ "errorCode": "2", "errorMessage": "Error on server, bc" });
            } else {
                logger.info("Bcrypt hash compared successfully");
                if (result) {
                    const token = jwt.sign({
                            id: user.id,
                            username: user.username,
                            type: user.type
                        },
                        process.env.JWT_KEY, {
                            expiresIn: "1d"
                        }
                    );
                    logger.info("Succesful Login for user: " + user.username);
                    res.status(200).json({
                        message: "Succesfull login",
                        token: token,
                        usuario: {
                            username: user.username,
                            type: user.type
                        }
                    });
                } else {
                    logger.info("Unsuccessful login user: " + user.username);
                    res.status(401).send({ "errorCode": "5", "errorMessage": "Autenticación fallida" });
                }
            }
        });
    })


}

exports.register = function(req, res) {
    console.log("2");
    bcrypt.hash(req.body.password, 10, (errb, hash) => {
        if (errb) {
            logger.error("Bcrypt error :" + errb.toString());
            return res.status(500).send({ "errorCode": "2", "errorMessage": "Error on server, bc" });
        } else {
            logger.info("Bcrypt hash created successfully");
            const query = {
                name: 'register-user',
                text: 'INSERT INTO users(username, password, type) VALUES($1, $2, 0)',
                values: [req.body.username, hash],
            }
            db.query(query, (err, rows) => {
                if (err) {
                    logger.error(err);
                    return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
                }
                logger.info("User created");
                res.status(200).send({ "message": "User created." });
            })
        }
    })
};

exports.getUsers = function(req, res) {
    console.log("3");
    const query = {
        name: 'get-users',
        text: 'SELECT id, username, type FROM users WHERE NOT id = $1',
        values: [req.userData.id]
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("Users fetched");
        res.status(200).send({ "rows": rows.rows });
    })
}

exports.editUser = function(req, res) {
    console.log("4");
    if (!req.body || !req.body.id || !req.body.type) {
        logger.error("Bad request");
        return res.status(400).send({ "errorCode": "400", "errorMessage": "Bad request" });
    }
    const query = {
        name: 'edit-user',
        text: 'UPDATE users SET type = $1 WHERE id = $2',
        values: [req.body.type, req.body.id]
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("User updated ");
        res.status(200).send({ "message": "User updated" });
    })
}

exports.deleteUser = function(req, res) {
    if (!req.body || !req.body.id) {
        logger.error("Bad request");
        console.log(req.body);
        return res.status(400).send({ "errorCode": "400", "errorMessage": "Bad request" });
    }
    const query = {
        name: 'delete-user',
        text: 'DELETE FROM users WHERE id = $1',
        values: [req.body.id]
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("User deleted , id " + req.body.id);
        const query2 = {
            name: 'deletebooks-user',
            text: 'UPDATE books SET iduser = null, datereserved= null WHERE iduser = $1',
            values: [req.body.id]
        }
        db.query(query2, (err, rows) => {
            if (err) {
                logger.error(err);
                return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
            }
            logger.info("User deleted , id " + req.body.id);
            res.status(200).send({ "message": "User deleted" });
        })
    })
    
}

exports.getBooks = function(req, res) {
    console.log("6");
    const query = {
        name: 'get-books',
        text: 'SELECT ID, TITLE, AUTHOR, URLIMAGE , DESCRIPTION , DATERESERVED FROM books'
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("Books fetched");
        res.status(200).send({ "rows": rows.rows });
    })
}

exports.getBooksFull = function(req, res) {
    console.log("7");
    const query = {
        name: 'get-books-full',
        text: 'SELECT * FROM books'
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("Books fetched");
        res.status(200).send({ "rows": rows.rows });
    })
}

exports.addBook = function(req, res) {
    console.log("9");
    if (!req.body || !req.body.title || !req.body.author || !req.body.description) {
        logger.error("Bad request");
        return res.status(400).send({ "errorCode": "400", "errorMessage": "Bad request" });
    }
    let text = 'INSERT INTO books(title, author, description) VALUES($1, $2, $3)';
    let values = [req.body.title, req.body.author, req.body.description]
    if (req.body.urlimage){
        text = "INSERT INTO books(title, author, description, urlimage) VALUES($1, $2, $3, $4)"
        values.push(req.body.urlimage)
    }
    const query = {
        name: 'add-book',
        text: text,
        values: values,
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("Book saved");
        res.status(200).send({ "message": "Book saved." });
    })
}

exports.editBook = function(req, res) {
    console.log("10");
    if (!req.body || !req.body.title || !req.body.author || !req.body.id || !req.body.description) {
        logger.error("Bad request");
        return res.status(400).send({ "errorCode": "400", "errorMessage": "Bad request" });
    }
    const query = {
        name: 'edit-book',
        text: "UPDATE books SET title = $1 , author = $2, description = $3, urlimage=$5 WHERE id = $4",
        values: [req.body.title, req.body.author, req.body.description, req.body.id, req.body.urlimage]
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("Book updated ");
        res.status(200).send({ "message": "Book updated" });
    })
}

exports.deleteBook = function(req, res) {
    if (!req.body || !req.body.id) {
        logger.error("Bad request");
        return res.status(400).send({ "errorCode": "400", "errorMessage": "Bad request" });
    }
    const query = {
        name: 'delete-book',
        text: 'DELETE FROM books WHERE id = $1',
        values: [req.body.id]
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("Book deleted , id " + req.body.id);
        res.status(200).send({ "message": "Book deleted" });
    })
}


exports.reserveBook = function(req, res) {
    console.log("10");
    if (!req.body || !req.body.id || !req.userData.id) {
        logger.error("Bad request");
        return res.status(400).send({ "errorCode": "400", "errorMessage": "Bad request" });
    }
    const query = {
        name: 'reserve-book',
        text: 'UPDATE books SET iduser = $1, datereserved = $2  WHERE id = $3',
        values: [req.userData.id, new Date(), req.body.id]
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("Book" + req.body.id + " reserved by user id " + req.userData.id);
        res.status(200).send({ "message": "Book reserved" });
    })
}

exports.returnBook = function(req, res) {
    if (!req.body || !req.body.id || !req.userData.id) {
        logger.error("Bad request");
        return res.status(400).send({ "errorCode": "400", "errorMessage": "Bad request" });
    }
    const query = {
        name: 'return-book',
        text: 'UPDATE books SET iduser = null , datereserved = null WHERE id = $1',
        values: [req.body.id]
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("Book" + req.body.id + " returned by user id " + req.userData.id);
        res.status(200).send({ "message": "Book returned" });
    })
}

exports.getReservedBooks = function(req, res) {
    if (!req.userData.id) {
        logger.error("Bad request");
        return res.status(400).send({ "errorCode": "400", "errorMessage": "Bad request" });
    }
    const query = {
        name: 'get-reserved-books',
        text: 'SELECT * FROM books WHERE iduser = $1',
        values: [req.userData.id]
    }
    db.query(query, (err, rows) => {
        if (err) {
            logger.error(err);
            return res.status(500).send({ "errorCode": "3", "errorMessage": "Error on server" });
        }
        logger.info("Books fetched");
        res.status(200).send({ "rows": rows.rows });
    })
}