require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret= process.env.SECRET;

const authoriseToken = (req, res, next) => {
    const token = req.headers.authtoken //token is stored in cook
    // console.log(token)
    if(!token) return res.status(401).send('Access Denied');
    try{
        const verified = jwt.verify(token, secret);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }
}

module.exports = authoriseToken;