const { client } = require("./db");
const { ObjectId } = require("mongodb");
const { URI } = require("./config");
const {decode} = require("jsonwebtoken");
const decodeToken = require("./decoder/decoder");

const usersDB = client.db('shopco').collection('users');
const ordersDB = client.db('shopco').collection('orders');

const activityUser = async (req, res) => {
    const userId = new ObjectId(req.params.link);
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
        const userIdCoded = req.body.token;
        const userIdDecoded = decodeToken(userIdCoded);
        const userId = new ObjectId(userIdDecoded);
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
        const userIdCoded = req.body.token;
        const userIdDecoded = decodeToken(userIdCoded);
        const orders = await ordersDB.find({ user: userIdDecoded }).toArray();
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




module.exports = {
    activityUser,
    aboutUser,
    ordersUser
};

// const bcrypt = require('bcrypt');
//
// const password = 'your_password_here'; // Пароль, який ви хочете перевірити
// const hashPassword = bcrypt.hashSync(password, 7); // Хешований пароль, отриманий за допомогою bcrypt.hashSync
//
// // Перевірка пароля
// const isPasswordMatched = bcrypt.compareSync(password, hashPassword);
//
// if (isPasswordMatched) {
//     console.log('Пароль співпадає.');
// } else {
//     console.log('Пароль не співпадає.');
// }
