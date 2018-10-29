let mysql = require('mysql');


require('dotenv').config();

let db = mysql.createConnection({
    host : process.env.DB_HOST,
    database : process.env.DB_NAME,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PWD
});


db.connect((err) => {
    if(err) throw err;
    console.log(`Connected to mysql`);
});
module.exports = db;