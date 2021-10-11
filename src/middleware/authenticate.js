const jwt = require('jsonwebtoken');
require('dotenv').config();

let verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET_KEY, function(err, user) {
            if(err) return reject(err)

            return resolve(user)
        })
    })
}

async function authenticate (req,res,next) {

    const bearerToken = req.headers.authorization;

    if(! bearerToken || ! bearerToken.startsWith('Bearer ')) return res.status(403).send({message: 'Please provide a bearier token'});

    const token = bearerToken.split(' ')[1];
    
    try {
        const {user} = await verifyToken(token);
        req.user = user;

        return next();
        
    } catch(err) {
        res.status(403).send({message: err.message})
    }
}

module.exports = authenticate;