const { client } = require("./db");
const { sendMailServiceMassage } = require("./sendMailServise/sendMailServise");
const decoder = require("./decoder/decoder");
const { ObjectId } = require("mongodb");
const modifyArray = require("./createrNewArrSizes/createrNewArrSizes")

const ordersDB = client.db('shopco').collection('orders');
const usersDB = client.db('shopco').collection('users');
const goodsDB = client.db('shopco').collection('goods');

const ordersAdd = async (req, res) => {
    try {
        const goodsArr = req.body.goods;
        for (let i = 0; i < goodsArr.length; i++) {
            const item = goodsArr[i];
            const goodsId = new ObjectId(item._id);
            const good = await goodsDB.findOne({ _id: goodsId });
            const goodSizes = good.sizes
            const goodSizesNew = modifyArray (goodSizes, item.selectedSize , item.selectedAmount);
            await goodsDB.updateOne(
                {_id: goodsId },
                {$set:{sizes:goodSizesNew}})

        }
    } catch (error) {
        res.status(500).send("Server Error in goods processing");
        return;
    }

    try {
        const {userName, companyName, streetAddress, apartmentInfo, city, phoneNumber, email,payment } = req.body.personalInfo;
        const idUser = decoder(req.body.token);
        const userId = new ObjectId(idUser);
        const user = await usersDB.findOne({ _id: userId });
        const userEmail = user.email


        if (user) {
            await usersDB.updateOne(
                { _id: userId },
                {
                    $set: {
                        email:email,
                        userName:userName,
                        companyName: companyName,
                        apartmentInfo: apartmentInfo,
                        streetAddress: streetAddress,
                        city: city,
                        phoneNumber: phoneNumber,

                    }
                }
            );
        }
        if(req.body){
            const {goods}= req.body;


            const {insertedId} = await ordersDB.insertOne({user:userId.toString(), goods, payment, isOpen:true});
            sendMailServiceMassage(userEmail,insertedId.toString() );
        }

        res.send({
            status: 200,
            text : "Done",

        });
    } catch (error) {
        res.status(500).send("Server Error in user processing");
    }

};

module.exports = {
    ordersAdd
};


