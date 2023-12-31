const { client } = require("./db");
const { ObjectId } = require("mongodb");
const { URI } = require("./config");
const decodeToken = require("./decoder/decoder");
const bcrypt = require("bcrypt");
const { sendMailServiceMassageSupport, sendMailResetPassword} = require("./sendMailServise/sendMailServise");
const generateRandomPassword = require("./generationPassword/generationPassword");

const usersDB = client.db('shopco').collection('users');
const ordersDB = client.db('shopco').collection('orders');
const supportDB = client.db('shopco').collection('support');

const activityUser = async (req, res) => {
    const userId = new ObjectId(req.params.link);
    await client.connect()
    const user = await usersDB.findOne({ _id: userId });
    if (!user) {
        throw new Error("User not found");
    }
    await usersDB.updateOne(
        { _id: userId },
        { $set: { isActivated: true } }
    );
    console.log('User is activated.');
    return res.redirect(URI);
};

const aboutUser = async (req, res) =>{
    try {
        const userIdCoded = req.headers.authorization;
        const userIdDecoded = decodeToken(userIdCoded);
        const userId = new ObjectId(userIdDecoded);
        await client.connect()
        const user = await usersDB.findOne({ _id: userId });
        const { userName, companyName, streetAddress, apartmentInfo, city, phoneNumber, email } = user
        const answer ={userName, companyName, streetAddress, apartmentInfo, city, phoneNumber, email}
        return res.send({
            status:200,
            answer
        })
    } catch (error) {
        res.send({
            status:500,
            message:"Server Error in user processing"
        })
    }
}

const ordersUser = async (req, res) =>{
    try {
        const userIdCoded = req.headers.authorization;
        const userIdDecoded = decodeToken(userIdCoded);
        await client.connect()
        const cursor = await ordersDB.find({ user: userIdDecoded });
        const orders = await cursor.toArray();
        return res.send({
            status:200,
            orders
        })
    }catch (error) {
        return res.send({
            status:500,
            message:"Server Error in user processing"
        })
    }

}

const changeUser = async (req, res) => {
    const {userName, email, apartmentInfo, city, companyName, phoneNumber, streetAddress} = req.body
    const data = {
        userName:userName,
        email:email,
        apartmentInfo:apartmentInfo,
        city:city,
        companyName:companyName,
        phoneNumber:phoneNumber,
        streetAddress:streetAddress
    }

    try{
        await client.connect()
        const userIdCoded = req.headers.authorization;
        const userIdDecoded = decodeToken(userIdCoded);
        if(data){
            await usersDB.updateOne({ _id: new ObjectId(userIdDecoded) }, { $set: data })
            res.send({
                status:200,
                text : "Done"
            })
        }
    }catch (error) {
        return res.send({
            status:500,
            message:"Server Error in user processing"
        })
    }
}

const changeUserPass = async (req, res) => {
    const userIdCoded = req.headers.authorization;
    const userIdDecoded = decodeToken(userIdCoded);
    const {password, newPassword} = req.body
    try{
        await client.connect()
        const isUserBase = await usersDB.findOne({_id: new ObjectId(userIdDecoded)})
        if(!isUserBase) {
            return res.send({
                status:400,
                error:"User not found"
            })
        }
        const validPassword = bcrypt.compareSync(password, isUserBase.password);
        if(validPassword ){
            const hashedPassword = bcrypt.hashSync(newPassword, 7);
            await usersDB.updateOne({ _id: new ObjectId(userIdDecoded) },
                { $set: { password: hashedPassword } })
                res.send({
                    status:200,
                    text : "Done"
                })
        }if(!validPassword ){
            return res.send({
                status:400,
                error:"Error old password invalid"
            })
        }

    }catch (error) {
        return res.send({
            status:500,
            message:"Server Error in user processing"
        })
    }
}


const supportUser = async (req,res) =>{
    const userIdCoded = req.headers.authorization;
    const userIdDecoded = decodeToken(userIdCoded);
    const message = req.body

    try{
        await client.connect()
        const data = {message,userName:userIdDecoded}
        const {insertedId} = await supportDB.insertOne(data);
        const idString = insertedId.toString();

        const user = await usersDB.findOne({ _id: new ObjectId(userIdDecoded)});
        await sendMailServiceMassageSupport(user.email, idString)
        res.send({
            status:200,
            text : "Done"
        })

    }catch (error) {
        return res.send({
            status:500,
            message:"Server Error in user processing"
        })
    }
}

const resetPassword = async (req,res) => {
    const emailReq = req.body.email
    try{
        await client.connect()
        const user = await usersDB.findOne({email: emailReq});
        const userId =user._id.toString()
        const randomPassword =generateRandomPassword(8)
        await usersDB.updateOne({_id: new ObjectId(userId)},{
            $set: {env: randomPassword}});
        await sendMailResetPassword(emailReq,
            `https://shopcoserver.vercel.app/api/activityPassword/${randomPassword}`,
            randomPassword);
        return res.send({
            status:200,
            message:"Password reset"
        })

            // https://shopcoserver-git-main-chesterfalmen.vercel.app/api/

    }catch (error) {
        return res.send({
            status:500,
            message:"User not found"
        })
    }
};




const activityPassword = async (req, res) => {
    const passwordReq = req.params.link;
    const hashPassword = bcrypt.hashSync(passwordReq, 7)
    await client.connect()
    const user = await usersDB.findOne({ env: passwordReq });
    if (!user) {
        throw new Error("User not found");
    }
    await usersDB.updateOne(
        { env: passwordReq },
        { $set: { password: hashPassword, env:"" } }
    );
    console.log('Password is activated.');
    return res.redirect(URI);
};


module.exports = {
    activityUser,
    aboutUser,
    ordersUser,
    changeUser,
    changeUserPass,
    supportUser,
    resetPassword,
    activityPassword
};


