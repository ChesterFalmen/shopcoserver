const {client} = require("./db");

const ordersDB = client.db('shopco').collection('orders')

const ordersAdd = async (req, res) => {
    try {
        const good = req.body;
        const data = await ordersDB.insertOne(good);
        res.send({
            status: 200,
            info: data
        });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

module.exports ={
    ordersAdd
}