let jwt = require('jsonwebtoken');
let fs = require('fs');
var privateKey = fs.readFileSync('./jwtRS256.key','utf8');
var publicKey = fs.readFileSync('jwtRS256.key.pub','utf8');
var iss = "Gaurav Bothra";
var sub = "gauravma1503@ict.gnu.ac.in";
var aud = "http://bothraclasses.com";
var signOptions = {
    issuer : iss,
    subject: sub,
    audience: aud,
    algorithm: "RS256"
};

var verifyOptions = {
    issuer : iss,
    subject: sub,
    audience: aud,
    algorithms: ["RS256"]
};

module.exports = (req, res, next) => {
    let token = req.header("token");
    console.log(token);
    try {
        var verified = jwt.verify(token, publicKey, verifyOptions);
        req.verified = verified;
        console.log(verified);
        next();
    } catch(e) {
        res.json({"msg" : "Invalid Api Key"});
    }
};