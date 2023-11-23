const { client } = require("./db");
const {validationResult} = require("express-validator");
const {sendAddNewsletter} = require("./sendMailServise/sendMailServise");

const newsletterDB = client.db('shopco').collection('newsletter');

const addNewsletter = async (req, res) => {
    const {email}=req.body;
    const messeging ={
        email:email
    }
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const findEmail =await newsletterDB.findOne({email: email})
        if(!findEmail){
            await newsletterDB.insertOne(messeging);
            await sendAddNewsletter(email)
            return res.send({
                status: 200,
            })
        }else{
            return res.send({
                status:400,
                message:"The user is already subscribed to the store"
            })
        }


    }catch (error) {
        res.status(500).send("Server Error");
    }

};

module.exports = {
    addNewsletter
}