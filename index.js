const express = require('express');
const cors = require('cors')
const { MongoClient, ObjectId } = require("mongodb")
const config = require("./config")


const app = express()
app.use(cors({
    origin: '*'
}))

app.use(express.json())

const client = new MongoClient(config.MONGO_CONNECTION_STRING)
const usersDB = client.db('shopco').collection('users')
const goodsDB = client.db('shopco').collection('goods')
const commentsDB = client.db('shopco').collection('comments')
const bannersDB = client.db('shopco').collection('banners')

client.connect()

async function run() {
    try {
        await client.connect();
        console.log("You are connected to MongoDB!");
    } catch (error) {
        console.error("Error connected to MongoDB:", error);
    }
}
run()

// app.get('/api/users', async (req, res)=>{
//     const data = await usersDB.find().toArray()
//     res.send(data)
// })

/* Дістати данні про одного користувача по id */
app.get('/api/users/:id', async (req, res)=>{
    const data = await usersDB.findOne({_id: new ObjectId(req.params.id)})
    res.send(data)
})

/* Реєстрація користувача */
app.post('/api/users', async (req, res)=>{
    console.log(req.body.username);
    const isUserBase = await usersDB.findOne({username: req.body.username});
    console.log(isUserBase);
    if(isUserBase){
        res.send({
            status:400,
            info:"Bad Request"
        })
    }else{
        const data = req.body;
        const tokenRandom = JSON.stringify(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
        const user = {...data, token:tokenRandom}
        const {insertedId} = await usersDB.insertOne(user);
        res.send({
            status:'ok',
            id:insertedId
        })
    }
})


/* Перевірка чи існує користувач, якщо існує - повертає token */
app.post('/api/login', async (req, res)=>{
    const isUserBase = await usersDB.findOne({username: req.body.username});
    const isUserBasePassword = await usersDB.findOne({password: req.body.password});
    if(!isUserBase){
        res.send({
            status:400,
            info:"Incorrect password or email"
        })
    } else if(isUserBase && !isUserBasePassword ){
        res.send({
            status:400,
            info:"Incorrect password "
        })
    } else if(isUserBase && isUserBasePassword ){
        res.send({
            status:200,
            token: isUserBase.token

        })
    }
})


/* Оновити данні корситувача по id */
app.put('/api/users/:id', async (req, res)=>{
    const data = req.body
    await usersDB.updateOne({ _id: new ObjectId(req.params.id) }, { $set: data });
    res.send({status:200})
})

/* Видалити користувача по id*/
app.delete('/api/users/:id', async (req, res)=>{
    const data = req.body
    await usersDB.deleteOne({ _id: new ObjectId(req.params.id)});
    res.send({status:200})
})


/* Отримати всі товари */
app.get('/api/goods', async (req, res)=>{
    const data = await goodsDB.find().toArray();
    data.reverse();
    res.send(data)
})


/* Отримати останні count товарів */
app.get('/api/goods/:count', async (req, res)=>{
    const data = await goodsDB.find().toArray();
    const count_goods_arr = data.length;
    console.log(count_goods_arr);
    const data_new = data.slice(count_goods_arr-req.params.count);
    data_new.reverse();
    res.send(data_new)
})

/*Отримати рейтинг товарів у кількості count */
app.get('/api/getRatingGoods/:count', async (req, res)=>{
    const data = await goodsDB.find().toArray();
    const sortData = data.sort((a, b) => b.count_sales - a.count_sales)
    const newData = sortData.slice(0, req.params.count);
    res.send(newData)
})

/* Додати товар */
app.put('/api/users/:id', async (req, res)=>{
    const data = req.body
    await usersDB.updateOne({ _id: new ObjectId(req.params.id) }, { $set: data });
    res.send({status:200})
})

app.get('/api/getAllComments', async (req, res)=>{
    console.log(req.body.data2);
    const data = await commentsDB.find().toArray();
    data.reverse();
    res.send(data)
})

/* Дістати коментарі для товару по id */
app.get('/api/comments/:id', async (req, res)=>{
    const data = await commentsDB.find({id_good: req.params.id}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
      });
    res.send(data)
})

/*Додати коментарі до товарів*/
app.post('/api/comments/add', async (req, res)=>{
    const data = req.body;
    if(data){
        await commentsDB.insertOne(data)
        res.send({
            status:200,
            text : "Done"
        })
    }else{
        res.send({
            status:200,
            text : "Sorry. Body is empty"
        })
    }


})


/* Отримати останні count коментарів */
app.get('/api/getCountComments/:count', async (req, res)=>{
    const data = await commentsDB.find().toArray();
    const count_goods_arr = data.length;
    console.log(count_goods_arr);
    const data_new = data.slice(count_goods_arr-req.params.count);
    data_new.reverse();
    res.send(data_new)
})

/* Отримати товари по заданій name категорії */
app.get('/api/category/:category', async (req, res)=>{
    const data = await goodsDB.find({category : req.params.category}).toArray();
    res.send(data);
})


app.get('/api/styles/:style', async (req, res) => {
    const data = await goodsDB.find( {style: req.params.style}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    res.send(data);
});

/* Отримати товари по заданій name статі */
app.get('/api/sex/:sex', async (req, res)=>{
    const data = await goodsDB.find({sex: req.params.sex}).toArray();
    res.send(data);
})

/* Вставити новий товар */
app.post('/api/goods/add', async (req, res)=>{

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
    console.log(name, price, url_image.length, discount != undefined, description, category, sex, sizes.length, rating, style, count_sales);
    if(name && price && url_image.length && discount != undefined && description && category && sex && sizes.length && rating && style && count_sales != undefined){
        const good = req.body;
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
})

app.get("/api/banners", async (req, res) =>{
    const data = await bannersDB.find().toArray();
    res.send(data);

});


module.exports = app;

// app.listen(3000, () => {
//     console.log("Сервер запущен на порту 3000");
// });
