const express = require('express');
const router = express.Router();
const {createProduct, searchProduct, deleteProduct, getProductById} = require('../models/Products')
const { isAuthenticated, isAdmin } = require("./authentication")

/*
*
curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"name": "Sample Product", "category": "Electronics", "tags": ["new", "popular", "sale"], "price": 99.99, "rating": 4.5}'
*/

//* Define the routes
router.route('/')
    .post( isAdmin, createProduct,
      (req, res) => {
        res.status(201).json(req.product);
    })
    .get(isAdmin, searchProduct,
      (req, res) => {
        const products = req.products;
        res.status(200).json(products);
    });

router.route('/:id')
    .get(isAuthenticated, getProductById,(req, res) => {
      res.status(200).json(req.product);
    })
    //TODO not updating
    .put(isAdmin, (req, res) => {
      res.send(`Updating ID: ${req.params.id}`);
    })
    .delete(isAdmin, deleteProduct, async (req, res) => {
      res.status(200).json(req.product);
    });

module.exports = router;