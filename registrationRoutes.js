const {client} = require("./db")
const bcrypt = require('bcrypt');
const {validationResult } = require('express-validator')

const usersDB = client.db('shopco').collection('users')


const registrationUser = async (req, res) =>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const isUserBase = await usersDB.findOne({email: req.body.email});
        console.log(isUserBase);
        if(isUserBase){
            return res.send({
                status:400,
                info:"Bad Request"
            })
        }else{
            const {username, password, email} = req.body;
            // const tokenRandom = JSON.stringify(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
            // const user = {...data, token:tokenRandom}

            const hashPassword = bcrypt.hashSync(password, 7)
            const user = {
                username: username,
                password: hashPassword,
                email:email
            }

            const {insertedId} = await usersDB.insertOne(user);
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
