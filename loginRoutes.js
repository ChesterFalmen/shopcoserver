const {client} = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret} = require("./userConfig")

const usersDB = client.db('shopco').collection('users')

const generationToken = (id, email) =>{
    const payload = {
        id,
        email
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}


const loginUser = async (req, res) => {
    const {username, password} = req.body

    try{
        const isUserBase = await usersDB.findOne({username: username});

        if(!isUserBase) {
            res.send({
                status: 400,
                info: "Incorrect password or email"
            })
        }

        const validPassword = bcrypt.compareSync(password, isUserBase.password)


        if(isUserBase && !validPassword ){
            console.log("isUserBase && !validPassword")
            res.send({
                status:400,
                info:"Incorrect password "
            })
        }
        const token = generationToken(isUserBase._id, isUserBase.username )
        return res.json({token})

    }catch (error) {
        res.status(500).send("Server Error");
    }
}

module.exports = {
    loginUser
}