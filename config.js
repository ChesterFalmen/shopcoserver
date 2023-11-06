// const str = require("./MONGO.js")
// const gmail = require("./GMAIL")
// const uri = require("./URI")
//
// const MONGO_CONNECTION_STRING = str.MONGO
// const GMAIL_CONNECTION_STRING = gmail.GMAIL
// const URI = uri.URI
//
// module.exports = {MONGO_CONNECTION_STRING, GMAIL_CONNECTION_STRING, URI}



const MONGO_CONNECTION_STRING = process.env.MONGO
const GMAIL_CONNECTION_STRING = process.env.GMAIL
const URI = process.env.URI

module.exports = {MONGO_CONNECTION_STRING,GMAIL_CONNECTION_STRING,URI }

