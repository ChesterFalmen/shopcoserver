
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { client } = require('./db');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(routes);


const start = async () => {
    try {
        await client.connect();
         console.log("You are connected to MongoDB!");
    } catch (error) {
        console.error("Error connected to MongoDB:", error);
    }
};


start();




module.exports = app;



// app.listen(3000, () => {
//     console.log(`Server start 3000`);
// });