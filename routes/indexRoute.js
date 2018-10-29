let express = require('express');
let _ = require('lodash');
let bcryptjs = require('bcryptjs');
let jwt = require('jsonwebtoken');
let fs = require('fs')
let path = require('path');
let Router = express.Router();

//DataBase OBJECT
// let db = require('../config/dbConfig');

//Including MiddleWare
let authMiddleWare = require('../middleWare/authMiddleWare');

let privateKey = fs.readFileSync('./jwtRS256.key', 'utf8');
let publicKey = fs.readFileSync('jwtRS256.key.pub', 'utf8');
let iss = "Gaurav Bothra";
let sub = "gauravma1503@ict.gnu.ac.in";
let aud = "http://bothraclasses.com";

let signOptions = {
    issuer: iss,
    subject: sub,
    audience: aud,
    algorithm: "RS256"
};

let verifyOptions = {
    issuer: iss,
    subject: sub,
    audience: aud,
    algorithms: ["RS256"]
};


Router.get('/', (req, res) => {
    res.render('index');
});

Router.get('/googlee619396a9d69de03.html', (req, res) => {
    res.send('google-site-verification: googlee619396a9d69de03.html');
})



module.exports = Router;