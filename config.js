// const str = require("./MONGO.js")
//
// console.log(str.MONGO)
//
// const MONGO_CONNECTION_STRING = str.MONGO
//
// module.exports = {MONGO_CONNECTION_STRING}

const MONGO_CONNECTION_STRING = process.env.MONGO

module.exports = {MONGO_CONNECTION_STRING}
