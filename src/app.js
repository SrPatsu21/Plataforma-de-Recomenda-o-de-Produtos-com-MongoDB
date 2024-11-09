const express = require('express');
// server listining
const hostname = "127.0.0.1";
const port = 3000;
// mongo
const { MongoClient } = require('mongodb');
const dbAddress = `localhost`;
const dbPort = 27017
const dbName = `test`;
const mongourl = `mongodb://${dbAddress}:${dbPort}/${dbName}`;

// app
const cats = ['Garfield', 'Tom', 'Simba'];

const app = express();
// app.use(express.json);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

app.get('/mongo', async(req, res) =>{
    const client = new MongoClient(mongourl);

    try {

        // Connect to the MongoDB cluster

        let test = await client.connect();
        test.than(data =>{
            console.log(data);
        }
        )
    } catch (e) {

        console.error(e);

    } finally {

        await client.close();

    }
})

app.get('/cats/:id', (req, res) =>{
        res.json(cats[req.params.id]);
});

app.get('/cats', (req, res) =>{
    res.json(cats);
});

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
});