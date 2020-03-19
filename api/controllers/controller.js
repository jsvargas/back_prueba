let jwt = require("jsonwebtoken");
let fs = require('fs');
let path = require('path');
let logger = require('../config/logger')(path.basename(__filename, '.js'));
require('dotenv').config();

exports.login = function(req, res) {
    console.log("1");
    res.sendStatus(200);
}

exports.register = function(req, res) {
    console.log("2");
    res.sendStatus(200);
}

exports.getUsers = function(req, res) {
    console.log("3");
    res.sendStatus(200);
}

exports.editUser = function(req, res) {
    console.log("4");
    res.sendStatus(200);
}

exports.deleteUser = function(req, res) {
    console.log("5");
    res.sendStatus(200);
}

exports.getBooks = function(req, res) {
    console.log("6");
    res.sendStatus(200);
}

exports.getBooksFull = function(req, res) {
    console.log("7");
    res.sendStatus(200);
}

exports.addBook = function(req, res) {
    console.log("9");
    res.sendStatus(200);
}

exports.editBook = function(req, res) {
    console.log("10");
    res.sendStatus(200);
}

exports.reserveBook = function(req, res) {
    console.log("11");
    res.sendStatus(200);
}