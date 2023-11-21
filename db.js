const { MongoClient } = require('mongodb');
const config = require("./config");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000,
    maxPoolSize: 50,
    wtimeoutMS: 25000,
    ssl:true
};

const client = new MongoClient(config.MONGO_CONNECTION_STRING, options);

async function connect() {
    await client.connect();
    console.log('Connected to the database');
}

module.exports = { connect, client };