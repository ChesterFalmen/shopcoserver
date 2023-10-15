const {client} = require("./db")
const {ObjectId} = require("mongodb");

const goodsDB = client.db('shopco').collection('goods')


const getAllGoods = async (req, res) => {
    try {
        const data = await goodsDB.find().toArray();
        res.send(data);
    } catch (error) {
        res.status(500).send("Server Error");
    }
};


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



const getRatingGoods = async (req, res) =>{
    try{
        const data = await goodsDB.find().toArray();
        const sortData = data.sort((a, b) => b.count_sales - a.count_sales)
        const newData = sortData.slice(0, req.params.count);
        res.send(newData)
    }catch (error) {
        res.status(500).send("Server Error");
    }
}


const getGoodsByCategory = async (req,res) => {
    try {
        const data = await goodsDB.find({category : req.params.category}).toArray();
        res.send(data);
    }catch (error) {
        res.status(500).send("Server Error");
    }
}



const getGoodsByStyle = async (req, res) => {
    try{
        const data = await goodsDB.find( {style: req.params.style}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
        });
        res.send(data);
    }catch (error) {
        res.status(500).send("Server Error");
    }
}



const getGoodsBySex = async (req, res) =>{
    try{
        const data = await goodsDB.find({sex: req.params.sex}).toArray();
        res.send(data);
    }catch (error) {
        res.status(500).send("Server Error");
    }
}



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
        //console.log(name, price, url_image.length, discount != undefined, description, category, sex, sizes.length, rating, style, count_sales);
        if(name && price && url_image.length && discount !== undefined && description && category && sex && sizes.length && rating && style && count_sales != undefined){
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

const updateFinalPrise = async (req, res) => {
    try{
        const data = req.body
        //await usersDB.updateOne({ _id: new ObjectId(req.params.id) }, { $set: data });


        // Найдем все документы в коллекции
        const documents = await goodsDB.find({}).toArray();

        // Обновим каждый документ, вычислив final_price и обновив запись
        for (const doc of documents) {
            const price = doc.price;
            const discount = doc.discount;
            const finalPrice = price - ((price * discount) / 100);

            // Обновляем документ с новым полем final_price
            await goodsDB.updateOne(
                { _id: doc._id },
                { $set: { final_price: finalPrice } }
            );
        }
        res.send({status:200})

        console.log('final_price был добавлен в каждую запись коллекции.');
    }catch (error) {
        res.status(500).send("Server Error");
    }
}



const getSaleGoods = async (req, res) =>{
    try{
        const data = await goodsDB.find().toArray();
        const filteredArr = data.filter(item => !!item.discount );
        res.send(filteredArr)
    }catch (error) {
        res.status(500).send("Server Error");
    }
}


module.exports = {
    getAllGoods,
    getOneGood,
    getRecentGoods,
    getRatingGoods,
    getGoodsByCategory,
    getGoodsByStyle,
    getGoodsBySex,
    addGood,
    getSaleGoods,
    updateFinalPrise
};