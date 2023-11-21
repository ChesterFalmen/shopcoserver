const {client} = require("./db")

const bannersDB = client.db('shopco').collection('banners')
const bannerLoginDB = client.db('shopco').collection('loginBanner')

const getBanners = async (req, res) =>{
    console.log("getBanners");
    try{
        const cursor = await bannersDB.find();
        const data = await cursor.toArray();
        res.send(data);
    }
    catch (error) {
        res.status(500).send("Server Error");
    }
}


const getLoginBanner = async (req, res) =>{
    console.log("getLoginBanner");
    try{
        const data = await bannerLoginDB.findOne();
        console.log(data);
        res.send(data);
    }catch (error) {
        res.status(500).send("Server Error");
    }
}


module.exports = {
    getBanners,
    getLoginBanner
}




