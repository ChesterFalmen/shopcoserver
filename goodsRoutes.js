const {client} = require("./db")
const {ObjectId} = require("mongodb");

const goodsDB = client.db('shopco').collection('goods')

//
// const getAllGoods = async (req, res) => {
//     try {
//         const data = await goodsDB.find().toArray();
//         res.send(data);
//     } catch (error) {
//         res.status(500).send("Server Error");
//     }
// };


const getOneGood = async (req, res) => {
    try {
        const data = await goodsDB.findOne({ _id: new ObjectId(req.params.id) });
        if (data) {
            res.send(data);
        } else {
            res.status(404).send("Good not found");
        }
    } catch (error) {
        res.status(500).send("Server Error");
    }
};


const getRecentGoods = async (req, res) => {
    try {
        const data = await goodsDB.find().toArray();
        const count_goods_arr = data.length;
        const data_new = data.slice(count_goods_arr - req.params.count);
        data_new.reverse();
        res.send(data_new);
    } catch (error) {
        res.status(500).send("Server Error");
    }
};



// const getRatingGoods = async (req, res) =>{
//     try{
//         const data = await goodsDB.find().toArray();
//         const sortData = data.sort((a, b) => b.count_sales - a.count_sales)
//         const newData = sortData.slice(0, req.params.count);
//         res.send(newData)
//     }catch (error) {
//         res.status(500).send("Server Error");
//     }
// }


// const getGoodsByCategory = async (req,res) => {
//     try {
//         const data = await goodsDB.find({category : req.params.category}).toArray();
//         res.send(data);
//     }catch (error) {
//         res.status(500).send("Server Error");
//     }
// }



// const getGoodsByStyle = async (req, res) => {
//     try{
//         const data = await goodsDB.find( {style: req.params.style}).toArray(function (err, result) {
//             if (err) throw err;
//             console.log(result);
//         });
//         res.send(data);
//     }catch (error) {
//         res.status(500).send("Server Error");
//     }
// }



// const getGoodsBySex = async (req, res) =>{
//     try{
//         const data = await goodsDB.find({sex: req.params.sex}).toArray();
//         res.send(data);
//     }catch (error) {
//         res.status(500).send("Server Error");
//     }
// }



const addGood = async (req,res) => {
    try{
        const name = req.body.name;//string
        const price = parseInt(req.body.price);//int32
        const url_image = req.body.url_image;//array
        const discount = parseInt(req.body.discount);//int32
        const description = req.body.description;//string
        const category = req.body.category;//string
        const sex = req.body.sex;//string
        const sizes = req.body.sizes;//array
        const rating = parseInt(req.body.rating);//int32
        const style = req.body.style;//string
        const count_sales = parseInt(req.body.count_sales);//int32
        const final_price = price - (price * (discount/100));
        const details  = req.body.details ;//string
        const about   = req.body.about  ;//string
        //console.log(name, price, url_image.length, discount != undefined, description, category, sex, sizes.length, rating, style, count_sales);
        if(name && price && url_image.length && about && details && discount !== undefined && description && category && sex && sizes.length && rating && style && count_sales != undefined){
            const good = {...req.body, final_price};
            const data = await goodsDB.insertOne(good);
            res.send({
                status:200,
                info: data
            })
        }else{
            res.send({
                status:400,
                info:"Incorrect data"
            })
        }

    }catch (error) {
        res.status(500).send("Server Error");
    }
}

// const updateFinalPrise = async (req, res) => {
//     try{
//
//         const documents = await goodsDB.find({}).toArray();
//
//         // Обновим каждый документ, вычислив final_price и обновив запись
//         for (const doc of documents) {
//             const price = doc.price;
//             const discount = doc.discount;
//             const finalPrice = price - ((price * discount) / 100);
//
//             // Обновляем документ с новым полем final_price
//             await goodsDB.updateOne(
//                 { _id: doc._id },
//                 { $set: { final_price: finalPrice } }
//             );
//         }
//         res.send({status:200})
//
//         console.log('final_price был добавлен в каждую запись коллекции.');
//     }catch (error) {
//         res.status(500).send("Server Error");
//     }
// }



const getSaleGoods = async (req, res) =>{
    try{
        const data = await goodsDB.find().toArray();
        const filteredArr = data.filter(item => !!item.discount );
        res.send(filteredArr)
    }catch (error) {
        res.status(500).send("Server Error");
    }
}

const search = async (req, res) => {
    const searchString = req.body.word
    try{
        const searchFields = ["name", "description", "category", "style", ];
        const query = {
            $or: searchFields.map(field => ({ [field]: { $regex: searchString, $options: "i" } }))
        };
        const resultArray = await goodsDB.find(query).toArray();
        return res.send({
            status:200,
            resultArray
        })

    }catch (error) {
        return res.send({
            status:500,
            message:"Server Error in user processing"
        })
    }
}

const productOther = async (req, res) => {
    const queryParams = req.query;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 9;
    const skip = (page - 1) * limit;
    const sort = queryParams.sort || "all";

    const query = {
    };

    let sortQuery = {};
    if (sort === "topsales") {
        sortQuery = { count_sales: -1 };
    } else if (sort === "new") {
        sortQuery = {_id: -1 };
    }

    try {

        const products = await goodsDB.find(query).sort(sortQuery).skip(skip).limit(limit).toArray();
        res.send({
            status:200,
            products
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "Server Error in user processing"
        });
    }
};



const product = async (req, res) => {
    const queryParams = req.query;
    const search = queryParams.search || "all";
    const sex = queryParams.sex || "all";
    const category = queryParams.category || "all";
    const style = queryParams.style || "all";
    const size = queryParams.size || "all";
    const minPrice = queryParams.minprice || 0;
    const maxPrice = queryParams.maxprice || Number.MAX_SAFE_INTEGER;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 9;
    const skip = (page - 1) * limit;
    const sort = queryParams.sort || "all";
    const hasDiscount = queryParams.hasdiscount || "all";

    const query = {

    };

    if (sex !== "all") {
        query.sex = sex;
    }

    if (style !== "all") {
        query.style = style;
    }
    if (category !== "all") {
        query.category = category;
    }
    if (minPrice || maxPrice) {
        query.final_price = {
            $gte: parseInt(minPrice),
            $lte: parseInt(maxPrice)
        };
    }
    if (size !== "all") {
        query.sizes = {
            $elemMatch: {
                size: size.toUpperCase(),
                count: { $gt: 0 }
            }
        };
    }

    if (hasDiscount !== "all") {
        query.discount = { $gt: 0 };
    }


    if (search !== "all") {
        const regex = new RegExp(search, 'i');
        query.name = regex;
    }

    let sortQuery = {};
    if (sort === "maxprice") {
        sortQuery = { final_price: -1 };
    } else if (sort === "minprice") {
        sortQuery = { final_price: 1 };
    } else if (sort === "old") {
        sortQuery = {_id: 1 };
    } else if (sort === "new") {
        sortQuery = {_id: -1 };
    }else if (sort === "az") {
        sortQuery = {name: 1 };
    }else if (sort === "za") {
        sortQuery = {name: -1 };
    }


    try {
        const totalCount = await goodsDB.countDocuments(query);
        const hasNextPage = skip + limit < totalCount;
        const products = await goodsDB.find(query).sort(sortQuery).skip(skip).limit(limit).toArray();
        res.send({
            status:200,
            hasNextPage: hasNextPage,
            products
        })


    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "Server Error in user processing"
        });
    }
};





module.exports = {
    // getAllGoods,
    getOneGood,
    getRecentGoods,
    // getRatingGoods,
    // getGoodsByCategory,
    // getGoodsByStyle,
    // getGoodsBySex,
    addGood,
    getSaleGoods,
    // updateFinalPrise,
    search,
    product,
    productOther
};

