const {client} = require("./db");
const {sendMailServisMassage, sendMailServiseLink} = require("./sendMailServise/sendMailServise")

const ordersDB = client.db('shopco').collection('orders')

const ordersAdd = async (req, res) => {
    try {
        const good = req.body;
        const data = await ordersDB.insertOne(good);
        // sendMailServisMassage("sergiy.ol.bondarenko@gmail.com", "Пошта дан","Пошта дан" )
        sendMailServiseLink("sergiy.ol.bondarenko@gmail.com", "https://www.google.com.ua/?hl=uk")

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