const express = require('express');
const hostname = "127.0.0.1";
const port = 3000;
const cats = ['Garfield', 'Tom', 'Simba'];

const app = express();
// app.use(express.json);

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