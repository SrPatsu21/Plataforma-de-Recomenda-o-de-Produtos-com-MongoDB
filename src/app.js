const express = require('express');
// server listining
const hostname = "127.0.0.1";
const port = 3000;
// mongo
const { MongoClient } = require('mongodb');
const mongourl = 'mongodb://localhost:27017';
const client = new MongoClient(mongourl);

// app
const cats = ['Garfield', 'Tom', 'Simba'];

const app = express();
// app.use(express.json);

app.get('/mongo', async(req, res) =>{
    try {
        await client.connect();
        let test = await listDatabases(client);
        test.than(data => {
            res.json(data)
        })
    } catch (e) {
        console.error(e);
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