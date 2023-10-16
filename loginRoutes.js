const {client} = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret} = require("./userConfig")

const usersDB = client.db('shopco').collection('users')

const generationToken = (id) =>{
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}


const loginUser = async (req, res) => {
    const {password, email} = req.body
    try{
        const isUserBase = await usersDB.findOne({email: email});

        if(!isUserBase) {
            return res.send({
                status: 400,
                info: "Incorrect password or email"
            })
        }
        const validPassword = bcrypt.compareSync(password, isUserBase.password)
        if(isUserBase && !validPassword ){
            return res.send({
                status:400,
                info:"Incorrect password "
            })
        }
        const token = generationToken(isUserBase._id )
        return res.json({token, email})

    }catch (error) {
        return res.status(500).send("Server Error");
    }
}

const isValideToken = async (req, res) =>{
    try{
       return  res.send({
           "user auth": true
       })
    }catch (errors){
        return res.status(500).send("Server Error");
    }
}



module.exports = {
    loginUser,
    isValideToken
}