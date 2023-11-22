const {client} = require("./db")

const bannersDB = client.db('shopco').collection('banners')
const bannerLoginDB = client.db('shopco').collection('loginBanner')

const getBanners = async (req, res) =>{
    try{
        await client.connect()
        const cursor = await bannersDB.find();
        const data = await cursor.toArray();
        res.send(data);
    }
    catch (error) {
        res.status(500).send("Server Error");
    }
}


const getLoginBanner = async (req, res) =>{
    try{
        await client.connect()
        const data = await bannerLoginDB.findOne();
        res.send(data);
    }catch (error) {
        res.status(500).send("Server Error");
    }
}


module.exports = {
    getBanners,
    getLoginBanner
}




