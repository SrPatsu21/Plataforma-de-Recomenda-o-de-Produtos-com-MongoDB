const express = require('express');
const router = express.Router();
const Products = require('../models/Products')
const { isAuthenticated, isAdmin } = require("./authentication")

/*
*
curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"name": "Sample Product", "category": "Electronics", "tags": ["new", "popular", "sale"], "price": 99.99, "rating": 4.5}'
*/

//* Define the routes
router.route('/')
    .post( isAdmin,
    async (req, res) => {
        const { name, img_url, category, tags, price, rating } = req.body;
        const active = true
        try {
        const newProduct = new Products({
            name,
            img_url,
            category,
            tags,
            price,
            rating,
            active
        });
        await newProduct.save();
        res.status(201).json(newProduct); // Return the newly created Product
        } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
        }
    })
    .get(isAdmin,
      async (req, res) => {
        try {
          const { name, tag, category } = req.query;
          const query = {};
          if (name) {
              query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
          }
          if (tag) {
              query.tags = { $in: [tag] }; // Tag must be in the product's tags array
          }
          if (category) {
              query.category = { $regex: category, $options: 'i' }; // Case-insensitive search
          }
          const products = await Products.find(query);
        res.status(200).json(products); // Return the list of matching products
        } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
        }
    });

router.route('/:id')
    .get(isAuthenticated, (req, res) => {
      res.send(`Fetching ID: ${req.params.id}`);
    })
    .put(isAdmin, (req, res) => {
      res.send(`Updating ID: ${req.params.id}`);
    })
    .delete(isAdmin, async (req, res) => {
      try{
        const product = await Products.findByIdAndUpdate(req.params.id,
          {active:false, updatedAt:null}
          ,
          { new: true, runValidators: true, overwrite: true }
        );
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(product);
      }
      catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

module.exports = router;