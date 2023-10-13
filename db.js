const { MongoClient } = require('mongodb');
const config = require("./config");

const client = new MongoClient(config.MONGO_CONNECTION_STRING);

async function connect() {
    await client.connect();
    console.log('Connected to the database');
}

module.exports = { connect, client };