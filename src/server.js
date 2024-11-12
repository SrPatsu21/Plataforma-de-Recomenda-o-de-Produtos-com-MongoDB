const express = require("express");
const connectDB = require("./db");
require("dotenv").config();

//* global var
const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

connectDB();

//* Products route
const Products = require('./models/Products')

// if needed   res.redirect('/new-route');

// Create a Products route
//*
/*
curl -X POST http://localhost:3000/Product \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Product",
    "category": "Electronics",
    "tags": ["new", "popular", "sale"],
    "price": 99.99,
    "rating": 4.5
  }'
*/
//*
app.post('/Product', async (req, res) => {
  const { name, category, tags, price, rating } = req.body;

  try {
    const newProduct = new Products({
      name,
      category,
      tags,
      price,
      rating
    });

    await newProduct.save();
    res.status(201).json(newProduct); // Return the newly created Product
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// select
app.get('/Products', async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products); // Return the list of matching products
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//* server loop
app.listen(port, () => {
  console.log(
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n-------------------------------------------------------------------------------------------------------------------------------\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n"
  );
  console.log(`Server is running on http://${hostname}:${port}`);
});