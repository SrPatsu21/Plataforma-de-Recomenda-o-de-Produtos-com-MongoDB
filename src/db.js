const { MongoClient } = require('mongodb');
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

async function connectDB()
{
    try {
        await client.connect();
        console.log("Connected to MongoDB...");
        // return client
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}

module.exports = connectDB;