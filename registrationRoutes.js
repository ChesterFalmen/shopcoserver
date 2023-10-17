const {client} = require("./db")
const bcrypt = require('bcrypt');
const {validationResult } = require('express-validator')
const {sendMailServiceLink} = require("./sendMailServise/sendMailServise");


const usersDB = client.db('shopco').collection('users')


const registrationUser = async (req, res) =>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const isUserBase = await usersDB.findOne({email: req.body.email});
        if(isUserBase){
            return res.send({
                status:400,
                info:"The user is already logged in"
            })
        }else{
            const {userName, password, email} = req.body;
            // const tokenRandom = JSON.stringify(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
            // const user = {...data, token:tokenRandom}
            const hashPassword = bcrypt.hashSync(password, 7)
            const user = {
                userName: userName,
                password: hashPassword,
                email:email
            }
            // const sendEmail = await send(email, activationLink )
            const {insertedId} = await usersDB.insertOne(user);
            sendMailServiceLink(email,
                ` https://shopcoserver-git-main-chesterfalmen.vercel.app/api/activate/${insertedId}`)
            return res.send({
                status:'ok',
                id:insertedId
            })
        }
    }catch (error) {
        res.status(500).send("Server Error");
    }

}

module.exports = {
    registrationUser
}
