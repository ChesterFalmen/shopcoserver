const jwt = require('jsonwebtoken');
const {secret} = require("../userConfig")

const authMiddleware = (req, res, next) =>{

    try {
        const token = req.headers.authorization;
        if(!token){
            return res.send({
                status:401,
                "userauth": false
            })
        }
        const decodeData = jwt.verify(token, secret);
        req.user = decodeData;
        next()

    }catch (error) {
        res.send({
            status:407,
            "user auth": false
        })
    }

}
module.exports = authMiddleware
