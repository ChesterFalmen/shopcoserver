const { MongoClient } = require('mongodb');
const config = require("./config");

const options = {
    serverSelectionTimeoutMS: 60000,
    maxPoolSize: 50,
    wtimeoutMS: 25000,
    useNewUrlParser: true,
    useUnifiedTopology: true

};

const client = new MongoClient(config.MONGO_CONNECTION_STRING, options);

async function connect() {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}




module.exports = { connect, client };