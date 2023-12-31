const {client} = require("./db")
const decodeToken = require("./decoder/decoder");
const {ObjectId} = require("mongodb");

const commentsDB = client.db('shopco').collection('comments');
const ordersDB = client.db('shopco').collection('orders');
const usersDB = client.db('shopco').collection('users');




// const addComment = async (req, res) => {
//     try{
//         const data = req.body;
//         if(data){
//             await commentsDB.insertOne(data)
//             res.send({
//                 status:200,
//                 text : "Done"
//             })
//         }else{
//             res.send({
//                 status:200,
//                 text : "Sorry. Body is empty"
//             })
//         }
//     }catch (error) {
//         res.status(500).send("Server Error");
//     }
// }


const getComments = async (req, res) => {
    const queryParams = req.query;
    const good = queryParams.good || "all";
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
        sortQuery = { _id: -1 };
    }

    try {
        await client.connect()
        const cursor = await commentsDB.find(query).sort(sortQuery).skip(skip).limit(limit);
        const data = await cursor.toArray();
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Errorcccc");
    }
};

const isHasAddComments = async (req, res) => {
    const userIdCoded = req.headers.authorization;
    const body = req.body
    const userIdDecoded = decodeToken(userIdCoded);

    const query = {
        'goods': {
            '$elemMatch': {
                '_id': `${body.id_good}`
            }
        },
        'user': `${userIdDecoded}`
    };

    try{
        await client.connect()
        const cursor = await ordersDB.find(query);
        const data = await cursor.toArray();
        if(data.length >0){
            res.send({
                status: 200,
                userHasAdd : true,

            });
        } else {
            res.send({
                status: 403,
                userHasAdd : false,
            });
        }

    }catch (error) {
        res.status(500).send("Server Errorttttt");
    }
}

const postComments = async (req, res) => {
    const userIdCoded = req.headers.authorization;
    const userIdDecoded = decodeToken(userIdCoded);
    const{id_good, text, rating}=req.body
    const userId = new ObjectId(userIdDecoded);

    try{
        await client.connect()
        const user = await usersDB.findOne({ _id: userId });
        const newComment = {
            id_good, text, rating, firstName:user.userName, lastName:user.userName
        }
        await commentsDB.insertOne(newComment)
        res.send({
            status: 200,
            newComment
        });



    }catch (error) {
        res.status(500).send("Server Erroryyyy");
    }
}



module.exports = {
    isHasAddComments,
    postComments,
    getComments
};