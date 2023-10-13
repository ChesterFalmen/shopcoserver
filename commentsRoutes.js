const {client} = require("./db")

const commentsDB = client.db('shopco').collection('comments')


const getAllComments = async (req, res) => {
    try{
        const data = await commentsDB.find().toArray();
        data.reverse();
        res.send(data)
    }catch (error) {
        res.status(500).send("Server Error");
    }
}


const getCommentsByGoodId = async (req, res) => {
    try{
        const data = await commentsDB.find({id_good: req.params.id}).toArray()
        res.send(data)
    }catch (error) {
        res.status(500).send("Server Error");
    }
}



const addComment = async (req, res) => {
    try{
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
    }catch (error) {
        res.status(500).send("Server Error");
    }
}


const getRecentComments = async (req, res) => {
    try{
        const data = await commentsDB.find().toArray();
        const count_goods_arr = data.length;
        console.log(count_goods_arr);
        const data_new = data.slice(count_goods_arr-req.params.count);
        data_new.reverse();
        res.send(data_new)

    }catch (error) {
        res.status(500).send("Server Error");
    }
}

//
// /* Отримати останні count коментарів */
// app.get('/api/getCountComments/:count', async (req, res)=>{
//     const data = await commentsDB.find().toArray();
//     const count_goods_arr = data.length;
//     console.log(count_goods_arr);
//     const data_new = data.slice(count_goods_arr-req.params.count);
//     data_new.reverse();
//     res.send(data_new)
// })

module.exports = {
    getAllComments,
    getCommentsByGoodId,
    addComment,
    getRecentComments
};