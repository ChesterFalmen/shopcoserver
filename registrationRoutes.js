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
            const user = "user"
            const hashPassword = bcrypt.hashSync(password, 7)
            const candidate = {
                userName: userName,
                password: hashPassword,
                email:email,
                roll:user
            }

            const {insertedId} = await usersDB.insertOne(candidate);
            sendMailServiceLink(email,
                ` https://shopcoserver-git-main-chesterfalmen.vercel.app/api/activate/${insertedId}`)
            return res.send({
                status: 200,
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
