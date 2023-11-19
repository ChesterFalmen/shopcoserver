const { client } = require("./db");
const { sendMailServiceMassage } = require("./sendMailServise/sendMailServise");

const { ObjectId } = require("mongodb");
const modifyArray = require("./createrNewArrSizes/createrNewArrSizes")

const ordersDB = client.db('shopco').collection('orders');
const usersDB = client.db('shopco').collection('users');
const goodsDB = client.db('shopco').collection('goods');
const basketDB = client.db('shopco').collection('basket');



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
        const {goods, payment, totalValue, orderDate}= req.body;
        const id = new ObjectId(req.user)
        const userEmail = await usersDB.findOne({_id:id})
        const {insertedId} = await ordersDB.insertOne({user:req.user.toString(), goods,
                payment:payment,
                orderDate:orderDate,
                totalValue:totalValue,
                isOpen:true});

        await basketDB.updateOne(
            {user:req.user.toString()},
            {$set:{basket:[]}}

        )

        await sendMailServiceMassage(userEmail.email, insertedId.toString());
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


