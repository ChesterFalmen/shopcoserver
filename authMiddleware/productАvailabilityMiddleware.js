const { client } = require("../db");
const { ObjectId } = require("mongodb");
const modifyArray = require("../createrNewArrSizes/createrNewArrSizes");
const goodsDB = client.db('shopco').collection('goods');

const checkCount = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].count < 0) {
            return false;
        }
    }
    return true;
};

const productAvailabilityMiddleware = async (req, res, next) => {
    try {
        const goodsArr = req.body.goods;
        for (let i = 0; i < goodsArr.length; i++) {
            const item = goodsArr[i];
            const goodsId = new ObjectId(item._id);
            const good = await goodsDB.findOne({ _id: goodsId });
            const goodSizes = good.sizes;
            const goodSizesNew = modifyArray(goodSizes, item.selectedSize, item.selectedAmount);
            const result = checkCount(goodSizesNew);
            if (!result) {
                return res.send({
                    status:400,
                    message: "Not enough in stock"
                })

            }
        }
        next();
    } catch (error) {
        res.send({
            status:400,
            message: "Not enough in stock"
        })

    }
};

module.exports = productAvailabilityMiddleware;