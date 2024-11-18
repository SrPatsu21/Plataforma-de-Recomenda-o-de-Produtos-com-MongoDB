const express = require('express');
const router = express.Router();
const Products = require('../models/Products')
const { isAuthenticated } = require("./authentication")

/*
*
curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"name": "Sample Product", "category": "Electronics", "tags": ["new", "popular", "sale"], "price": 99.99, "rating": 4.5}'
*/

// Define the routes
router.route('/')
    .post( isAuthenticated,
    async (req, res) => {
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
    })
    .get(isAuthenticated,
    async (req, res) => {
        try {
        const products = await Products.find();
        res.status(200).json(products); // Return the list of matching products
        } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
        }
    });

// TODO this was not done yet
router.route('/:id')
    .get((req, res) => {
      res.send(`Fetching user with ID: ${req.params.id}`);
    })
    .put((req, res) => {
      res.send(`Updating user with ID: ${req.params.id}`);
    })
    .delete((req, res) => {
      res.send(`Deleting user with ID: ${req.params.id}`);
    });

module.exports = router;