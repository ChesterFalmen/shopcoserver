const {client} = require("./db")
const bcrypt = require('bcrypt');
const {validationResult } = require('express-validator')
const {sendMailServiceLink} = require("./sendMailServise/sendMailServise");
const jwt = require("jsonwebtoken");
const {secret} = require("./userConfig");
const {ObjectId} = require("mongodb");


const usersDB = client.db('shopco').collection('users')

const generationToken = (id) =>{
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

const registrationUser = async (req, res) =>{
    const {userName, password, email} = req.body;
    await client.connect()
    const isUserBase = await usersDB.findOne({email: req.body.email});

    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if(isUserBase && isUserBase.password){
            return res.send({
                status:400,
                info:"The user is already logged in"
            })
        }
        if(isUserBase && !isUserBase.password){
            const updateUser = await usersDB.findOne({email:email});
            const userId = updateUser._id.toString()
            const hashPassword = bcrypt.hashSync(password, 7)

            const insertedId = new ObjectId(userId);
            await usersDB.updateOne(
                { _id: insertedId },
                {
                    $set: {
                        email:email,
                        userName:userName,
                        password: hashPassword
                    }
                })
            const token = generationToken(userId);
            await sendMailServiceLink(email,
                `https://shopcoserver-git-main-chesterfalmen.vercel.app/api/activate/${userId}`)
            return res.send({
                status: 200,
                token:token
            })

        }else {
            const hashPassword = bcrypt.hashSync(password, 7)
            const candidate = {
                userName: userName,
                password: hashPassword,
                email:email,
                roll:"user"
            }
            const {insertedId} = await usersDB.insertOne(candidate);
            const idString = insertedId.toString();
            const token = generationToken(idString);
            await sendMailServiceLink(email,
                `https://shopcoserver-git-main-chesterfalmen.vercel.app/api/activate/${idString}`)
            return res.send({
                status: 200,
                token:token
            })
        }

    }catch (error) {
        console.log("------")
        res.status(500).send("Server Error");
    }

}

const continueWidthGoogle = async (req, res) =>{
    const {password, email} = req.body;
    await client.connect()
    const isUserBase = await usersDB.findOne({email: req.body.email});

    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if(isUserBase && isUserBase.password){
            const token = generationToken(isUserBase._id.toString());
            return res.send({
                status: 200,
                token:token
            })
        }
        if(isUserBase && !isUserBase.password){
            const updateUser = await usersDB.findOne({email:email});
            const userId = updateUser._id.toString()
            const token = generationToken(userId);
            return res.send({
                status: 200,
                token:token
            })

        }else {
            const hashPassword = bcrypt.hashSync(password, 7)
            const candidate = {
                userName: userName,
                password: hashPassword,
                email:email,
                roll:"user"
            }
            const {insertedId} = await usersDB.insertOne(candidate);
            const idString = insertedId.toString();
            const token = generationToken(idString);
            await sendMailServiceLink(email,
                `https://shopcoserver-git-main-chesterfalmen.vercel.app/api/activate/${idString}`)
            return res.send({
                status: 200,
                token:token
            })
        }

    }catch (error) {
        console.log("------")
        res.status(500).send("Server Error");
    }

}




module.exports = {
    registrationUser
}
