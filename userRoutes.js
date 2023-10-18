const { client } = require("./db");
const { ObjectId } = require("mongodb");
const { URI } = require("./config");
const usersDB = client.db('shopco').collection('users');

const activityUser = async (req, res) => {
    const userId = new ObjectId(req.params.link);
    const user = await usersDB.findOne({ _id: userId });

    if (!user) {
        throw new Error("User not found");
    }

    await usersDB.updateOne(
        { _id: userId },
        { $set: { isActivated: true } }
    );

    console.log('User is activated.');
    return res.redirect(URI);
};



module.exports = {
    activityUser,
};


