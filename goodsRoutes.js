const {client} = require("./db")
const {ObjectId} = require("mongodb");

const goodsDB = client.db('shopco').collection('goods');

const getOneGood = async (req, res) => {

    try {
        await client.connect()
        const data = await goodsDB.findOne({ _id: new ObjectId(req.params.id) });
        if (data) {
            res.send(data);
        } else {
            res.status(404).send("Good not found");
        }
    } catch (error) {
        res.status(500).send("Server Error111");
    }
};



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
        res.status(500).send("Server Error222");
    }
}

// const reverceSize = async (req,res) => {
//     try{
//         await client.connect()
//         const data = await goodsDB.find().toArray();
//
//         const db = client.db("shopco");
//         const collection = db.collection('goods')
//         //
//         // await collection.find({}).toArray((err, documents) => {
//         //     if (err) throw err;
//
//             // Оновлення кожного документу, реверсуючи масив sizes
//         data.forEach((doc) => {
//                 const reversedSizes = doc.sizes.reverse(); // Реверс масиву sizes
//             console.log(reversedSizes);
//             collection.updateOne({_id: doc._id}, {$set: {sizes: reversedSizes}});
//             // });
//
//             console.log(`Оновлено документів`);
//
//
//         });
//
//
//
//         // res.send({
//         //     data
//         // })
//
//
//
//
//     }catch (error) {
//         res.status(500).send("Server Error222");
//     }
// }
//



const productOther = async (req, res) => {


    const queryParams = req.query;
    const sex = queryParams.sex || "all";
    const category = queryParams.category || "all";
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 9;
    const skip = (page - 1) * limit;
    const sort = queryParams.sort || "all";

    const query = {
    };

    let sortQuery = {};
    if (category !== "all") {
        query.category = category;
    }
    if (sex !== "all") {
        query.sex = sex;
    }

    if (sort === "topsales") {
        sortQuery = { count_sales: -1 };
    } else if (sort === "new") {
        sortQuery = { _id: -1 };
    }
    try {
        await client.connect()
        const cursor = await goodsDB.find(query).sort(sortQuery).skip(skip).limit(limit);
        const products = await cursor.toArray();
            res.send({
                status: 200,
                products
            });
    } catch (error) {
        console.log(error);
        return res.status(505).send({
            status: 505,
            message: "no goods"
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
        await client.connect()
        const totalCount = await goodsDB.countDocuments(query);
        const hasNextPage = skip + limit < totalCount;
        const cursor = await goodsDB.find(query).sort(sortQuery).skip(skip).limit(limit);
        const products = await cursor.toArray();
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

const updateUrl = async (req, res) =>{
    const id = req.body.id
    const arrUrls = req.body.urls
    try{
        await client.connect()
        if(id){
            await goodsDB.updateOne({ _id: new ObjectId(id) },
                { $set: {url_image: arrUrls}})
            res.send({
                status:200,
                text : "Done"
            })
        }

    }catch (error){
        return res.status(500).send({
            status: 500,
            message: "Server Error in user processing"
        })
    }
}




module.exports = {
    getOneGood,
    addGood,
    product,
    productOther,
    updateUrl,

};

