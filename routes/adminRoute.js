let express = require('express');
let _ = require('lodash');
let bcryptjs = require('bcryptjs');
let jwt = require('jsonwebtoken');
let fs = require('fs')
let path = require('path');
let Router = express.Router();
let crypto = require('crypto');

let db = require('../config/dbConfig');
let sessionMiddleware = require('../middleWare/sessionMiddleWare');
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



Router.get('/login', (req, res) => {
    res.render('admin/login');
});

Router.get('/addUser', sessionMiddleware,(req, res) => {
    res.render('admin/addUser');
});

Router.post('/addUser', (req,res) => {
    let body = _.pick(req.body, ['name', 'address','gender','email','password','HMAC']);
    crypto.randomBytes(64, (err, buf) => {
        if (err) throw err;
        body["token"] = buf.toString('hex');
        body["pushID"] = ""
    body["isMobileLogin"]=0
    console.log(body);
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(body.password, salt, (err, hash) => {
            if(err) {
                console.log("ERROR IN BCRZZZZZ");
            }
            body.password = hash;
            console.log(body);
            let sql = 'INSERT INTO users SET ?';
            let query =db.query(sql, [body], (err, result) => {
                if(err) {
                    console.log("Database ERROR");
                }
                res.send(result[0]);
            });
        });
    });
      });
    
});



Router.get('/', sessionMiddleware, (req, res) => {
    res.render('admin/')
});

Router.post('/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let sql = 'SELECT * FROM users WHERE email = ?';
    let query = db.query(sql, [body.email], (err, result) => {
        if(err) {
            req.flash('error_msg', '500 : DataBase Error...');
            res.status(500).redirect('/');
        }
        if(result.length > 0) {
            bcryptjs.compare(body.password, result[0].password, (berr, bres) => {
                console.log(body.password)
                if(bres) {
                    req.session.user = {
                        email : result[0].email,
                        role : 'admin',
                        name : result[0].name
                    };
                    console.log(bres);
                    res.status(200).redirect('/user/');
                } else {
                    req.flash('error_msg', '401 : Incorrect username and password');
                res.status(500).redirect('/');
                }
            });

        } else {
            console.log(body);
            req.flash('error_msg', '401 : Incorrect username and password');
            res.status(500).redirect('/');
        }
    });
});

 Router.post('/register', (req, res) => {
     let body = _.pick(req.body, ['username', 'password']);
     bcryptjs.genSalt(10, function(err, salt) {
         bcryptjs.hash(body.password, salt, function(err, hash) {
             if(err) {
                 res.status(500).end('Sorry Cannot create new user');
             }
             body.password = hash;

             let sql = 'INSERT INTO admin SET ?'
             let query = db.query(sql, [body], (err, result) => {
                 if(err) {
                     res.status(500).end('500 : Database Error');
					 console.log(err);
                 }
				 else{
					 res.status(200).end('successfully created user');
				 }
             });
     });
 });

 });

module.exports = Router;
