let db = require('../config/dbConfig');


module.exports = (req, res, next) => {
    
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');    if(req.session.user) {
        let email = req.session.user.email;
        if(req.session.user.role == 'user') {
            let sql = 'SELECT * FROM users where email = ?';
            let query = db.query(sql, [email], (err, result) => {
                if(err) {
                    req.session.user = null;
                    req.flash('error_msg', '500 : DataBase Error...');
                    res.redirect('/');
                } else {
                    if(result[0] != null) {
                        req.token = result[0].token;
                        next();
                    } else {
                        req.flash('error_msg', '401 : Invalid Email and Password');
                        res.redirect('/');
                    }
                }
            });
        } else if(req. session.user.role == 'admin') {
            let sql = 'SELECT * FROM admin where username = ?';
            let query = db.query(sql, [email], (err, result) => {
                if(err) {
                    req.session.user = null;
                    req.flash('error_msg', '500 : DataBase Error...');
                    res.redirect('/');
                } else {
                    if(result[0] != null) {
                        next();
                    } else {
                        req.flash('error_msg', '401 : Invalid Email and Password');
                        res.redirect('/');
                    }
                }
            });
        } else {
             res.redirect('/');
        }
    } else {
        let userReq = req.originalUrl;
        let baseURL = userReq.split("/");
        if(baseURL[1] == 'admin') {
             res.redirect('/admin/login');
        } else if(baseURL[1] == 'manager') {
            res.redirect('/manager/login');
        } else if(baseURL[1] == 'student') {
            res.redirect('/student/login');
        } else {
            console.log('dcsdcsdc');
            res.redirect('/');
        }
   }
} ;