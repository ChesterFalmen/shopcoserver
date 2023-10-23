const {client} = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret} = require("./userConfig")
const {ObjectId} = require("mongodb");

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
                status:400,
                error:"Incorrect password or email"
            })


        }
        const validPassword = bcrypt.compareSync(password, isUserBase.password)

        if(isUserBase && !validPassword ){
            return res.send({
                status:400,
                error:"Incorrect password"
            })

        }
        const token = generationToken(isUserBase._id );

        return res.send({
                status:200,
                info:{token, email}
                })


    }catch (error) {
        return res.send({
                    status:500,
                    error:"Server Error"
                })

    }
}

const isValideToken = async (req, res) =>{
    const token = req.headers.authorization;
    try{
        const decodeData = jwt.verify(token, secret);
        const userId = decodeData.id
        const isUserBase = await usersDB.findOne({_id: new ObjectId(userId)})
        if(!isUserBase){
            return res.send({
                status:400,
                "user auth": false
            })
        }

        return res.send({
            status:200,
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