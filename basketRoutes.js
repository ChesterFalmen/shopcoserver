const {client} = require("./db");
const mergeArrays = require ("./merginArray/merginArr");
const decodeToken = require("./decoder/decoder");


const basketDB = client.db('shopco').collection('basket');

const mergeBasket = async (req,res) =>{
    const {basket} = req.body
    const userIdCoded = req.headers.authorization;
    const userIdDecoded = decodeToken(userIdCoded);
    await client.connect()
    const basketUser = await basketDB.findOne({user:userIdDecoded});

    try {
        if (basketUser){
            const newArr = mergeArrays( basketUser.basket, basket);
            await basketDB.updateOne(
                {user:userIdDecoded},
                {$set:{basket:newArr}}

            )
            return res.send({
                status:200,
                basket:newArr
            })
        }else{
            await basketDB.insertOne({
                user:userIdDecoded,
                basket:basket
            })
            return res.send({
                status:200,
                basket:basket
            })
        }

    }catch (error) {
        return res.status(500).send("Server Error in goods processing");
    }

}

const refreshBasket = async (req,res) =>{
    const {basket} = req.body
    const userIdCoded = req.headers.authorization;
    const userIdDecoded = decodeToken(userIdCoded);
    await client.connect();
    const basketUser = await basketDB.findOne({user:userIdDecoded});

    try {
        if (basketUser){
            await basketDB.updateOne(
                {user:userIdDecoded},
                {$set:{basket:basket}}

            )
            return res.send({
                status:200,
                basket:basket
            })
        }else{
            await basketDB.insertOne({
                user:userIdDecoded,
                basket:basket
            })
            return res.send({
                status:200,
                basket:basket
            })
        }

    }catch (error) {
        return res.status(500).send("Server Error in goods processing");
    }

}

const getBasket = async (req, res)=> {
    const userIdCoded = req.headers.authorization;
    const userIdDecoded = decodeToken(userIdCoded);
    await client.connect()
    const basketUser = await basketDB.findOne({user:userIdDecoded});
    try{
        if(basketUser){
            return res.send({
                status:200,
                basket:basketUser.basket
            })
        }else {
            await basketDB.insertOne({
                user:userIdDecoded,
                basket:[]
            })
            return res.send({
                status:200,
                basket:[]
            })
        }

    }catch (error) {
        return res.status(500).send("Server Error in goods processing");
    }
}



module.exports = {
    refreshBasket,
    getBasket,
    mergeBasket
}
