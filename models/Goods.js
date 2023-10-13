const { Schema, model } = require('mongoose');




const Goods = new Schema({
    _id: {type:String},
    name: {type:String},
    sex: {type:String},
    price: {type:Number},
    discount: {type:Number},
    count_sales: {type:Number},
    category: {type:String},
    style: {type:String},
    final_price: {type:Number},
    rating: {type:Number},
    url_image: {type:Array},
    sizes: {type:Array}
});

module.exports = model("Goods" , Goods)