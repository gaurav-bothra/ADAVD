let express = require('express');
let _ = require('lodash');
let bcryptjs = require('bcryptjs');

let Router = express.Router();

//DataBase OBJECT
let db = require('../config/dbConfig');

//Including MiddleWare
let authMiddleWare = require('../middleWare/authMiddleWare');


Router.get('/', (req, res) => {
    res.json({"msg" : "Please Send Route to Valid Endpoint"})
});



Router.post('/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    console.log(body);
    let sql = 'SELECT * FROM users WHERE email = ?';
    let query = db.query(sql, [body.email], (err, result) => {
        if(err) {
            console.log('In THIS');
            res.status(500).end({"msg":"Database Error"});
        } else{
            if(result[0] != null) {
                bcryptjs.compare(body.password, result[0].password, (berr, bres) => {
                    if(bres) {
                        res.json({"token":result[0].token});
                    }
                    res.status(401).end({"msg":"unauth user"});
                });
            } else {
                res.status(401).end({"msg":"unauth user"});
            }
        }
    });
});



module.exports = Router;