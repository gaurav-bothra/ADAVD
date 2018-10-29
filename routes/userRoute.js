let express = require('express');
let _ = require('lodash');
let bcryptjs = require('bcryptjs');
let jwt = require('jsonwebtoken');
let fs = require('fs')
let path = require('path');
let Router = express.Router();

//DataBase OBJECT
 let db = require('../config/dbConfig');

//Including MiddleWare
let sessionMiddleWare = require('../middleWare/sessionMiddleWare');

Router.get('/', sessionMiddleWare, (req, res) => {
    let sql = 'SELECT isMobileLogin FROM users WHERE token = ?'
    let query = db.query(sql, [req.token], (err, result) => {
        if(err) {
            req.flash('error_msg', '500 : DataBase Error...');
            res.status(500).redirect('/');
        }
        if(result[0].isMobileLogin === 1){
            res.render('user/index', {
                isLogin : true,
                token : req.token
            });
        } else {
            res.render('user/index', {
                isLogin : false,
                token : req.token
            })
        }
    });

});

Router.get('/ml', sessionMiddleWare,(req, res) => {
    res.render('user/mlsimulation');
});

Router.get('/dashboard', sessionMiddleWare, (req, res) => {
    let sql = 'SELECT isMobileLogin FROM users WHERE token = ?'
    let query = db.query(sql, [req.token], (err, result) => {
        if(err) {
            req.flash('error_msg', '500 : DataBase Error...');
            res.status(500).redirect('/');
        }
        if(result[0].isMobileLogin === 1){
            res.render('user/index', {
                isLogin : true,
                token : req.token
            });
        } else {
            res.render('user/index', {
                isLogin : false,
                token : req.token
            })
        }
    });
});

Router.post('/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let sql = 'SELECT * FROM users WHERE email = ?';
    let query = db.query(sql, [body.email], (err, result) => {
        if(err) {
            req.flash('error_msg', '500 : DataBase Error...');
            res.status(500).redirect('/');
        }
        if(result[0] != null) {
            bcryptjs.compare(body.password, result[0].password, (berr, bres) => {
               
                console.log(body.password)
                if(bres) {
                    req.session.user = {
                        email : result[0].email,
                        role : 'user',
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

Router.get('/getConfig', sessionMiddleWare, (req,res)=>{
    let sql = "SELECT * FROM users where token = ?";
    let query = db.query(sql,[req.token],(err,result)=>{
        if(err)
        {
            throw err;
        }
        else
        {
            let jsonFile = {
                token : result[0].token,
                pushID : result[0].pushID
            }

            fs.writeFileSync(`${path.join(__dirname,jsonFile.token)}.json`, JSON.stringify(jsonFile));
            res.header("Content-Type",'application/json');
            res.download(`${path.join(__dirname, jsonFile.token) }.json`);

        }
    });
});




module.exports = Router;
