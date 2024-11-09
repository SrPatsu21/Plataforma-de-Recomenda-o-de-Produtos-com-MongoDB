const express = require('express');
// server listining
const hostname = "127.0.0.1";
const port = 3000;
// mongo
const { MongoClient } = require('mongodb');
const dbAddress = `db`;
const user = `root`
const pass = `root`
const dbPort = 27017
const dbName = `test`;
const mongourl = `mongodb://${user}:${pass}@${dbAddress}:${dbPort}`;

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
        // Connect to MongoDB server
        await client.connect();

        console.log('Connected to MongoDB');

        // Select the database and collection
        const database = client.db('testdb');
        const collection = database.collection('users');

        // Document to be inserted
        const userDocument = {
          name: 'John Doe',
          age: 30,
          email: 'johndoe@example.com',
          createdAt: new Date(),
        };

        // Insert the document into the collection
        const result = await collection.insertOne(userDocument);
        console.log(`Document inserted with _id: ${result.insertedId}`);

        res.json("ok");
    } catch (err)
    {
        res.json("fails");
        console.error('Error inserting document:', err);
    } finally
    {
        // Close the connection to the MongoDB server
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