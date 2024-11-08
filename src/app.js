const express = require('express');
const cats = ['Garfield', 'Tom', 'Simba'];

const app = express();
// app.use(express.json);

app.get('/cats/:id', (req, res) =>{
        res.json(cats[req.params.id]);
});

app.get('/cats', (req, res) =>{
    res.json(cats);
});
//* curl -X POST -H "Content-Type: application/json" -d '{"name": "Felix"}' http://localhost:5000/cats
// app.post('/cats', (req, res) => {
//     // cats.push(req.body.name);
//     console.log(req.name)
//     res.json(cats);
// });
// curl -X POST -H 'Content-Type: application/json' -d '{"name":"Felix"}' http://localhost:5000/cats/0

// curl -X PUT -H "Content-Type: application/json" -d '{"name": "Felix"}' http://localhost:5000/cats/edit/0
// app.put('/cats/edit/:id', (req, res) => {
//     cats[req.params.id] = req.body.name;
//     res.json(cats);
// });

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});