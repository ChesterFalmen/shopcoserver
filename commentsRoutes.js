const {client} = require("./db")

const commentsDB = client.db('shopco').collection('comments')


// const getAllComments = async (req, res) => {
//     try{
//         const data = await commentsDB.find().toArray();
//         data.reverse();
//         res.send(data)
//     }catch (error) {
//         res.status(500).send("Server Error");
//     }
// }


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


const getComments = async (req, res) => {
    const queryParams = req.query;
    const good =queryParams.good || "all";
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 9;
    const skip = (page - 1) * limit;
    const sort = queryParams.sort || "all";

    const query = {};
    if (good !== "all") {
        query.id_good = good;
    }

    let sortQuery = {};
    if (sort === "new") {
        sortQuery = {_id: -1}
    }

    try{
        const data = await commentsDB.find(query).sort(sortQuery).skip(skip).limit(limit).toArray();
        res.send(data)

    }catch (error) {
        res.status(500).send("Server Error");
    }
}

// const getComments = async (req, res) => {
//     try{
//         const data = await commentsDB.find().toArray();
//         const count_goods_arr = data.length;
//         console.log(count_goods_arr);
//         const data_new = data.slice(count_goods_arr-req.params.count);
//         data_new.reverse();
//         res.send(data_new)
//
//     }catch (error) {
//         res.status(500).send("Server Error");
//     }
// }



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
    getCommentsByGoodId,
    addComment,
    getComments
};