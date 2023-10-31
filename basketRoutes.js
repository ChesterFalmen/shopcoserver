
const {client} = require("./db");
const mergeArrays = require ("./merginArray/merginArr");



const refreshBasket = async (req,res) =>{
    const {goods} = req.body
    try {
        const newArr = mergeArrays( arrOld, goods)
        console.log("refreshBasket", newArr)
    }catch (error) {
        return res.status(500).send("Server Error in goods processing");

    }
}

const arrOld = [
    {
        _id:"653c9e1a7d0e3df16ac9e9cf" ,
        selectedSize : "L"
    },
    // {
    //     _id:"6529234342f9d6355ab84916" ,
    //     selectedSize : "XL"
    // }
]

module.exports = {
    refreshBasket
}
