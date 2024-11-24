const express = require('express');
const router = express.Router();
const { isAdmin } = require("./authentication")
const {createProduct, searchProduct, deleteProduct} = require('../models/Products')
require("dotenv").config();

//* get admin page html
router.get('/', isAdmin, (req, res) =>{
  const title = 'Admin main';
  res.render('./admin/layout_adm', {title},);
});

//* register product
router.get('/register_product', isAdmin, (req, res) =>{
    const title = 'Register Product';
    const post_destiny = '/admin/register_product/';
    res.render('./admin/create_product', {title, post_destiny},);
  });

router.post('/register_product', isAdmin, createProduct,
  (err, req, res) => {
    if(err){
      res.status(500).send('Server error');
    }
    res.status(201).redirect('/admin/list_products'); // Return to list
  });

//* list products
router.get('/list_products', isAdmin, searchProduct, (req, res) =>{
  const title = 'List Products';
  let { name, tag, category } = req.query;
  if(!name){name = ""};
  if(!tag){tag = ""};
  if(!category){category = ""};
  const products = req.products;
  res.render('./admin/list_products', {title, products, name, tag, category},);
})

//* delete product
router.delete('/product/:id', isAdmin, deleteProduct, async(req, res) =>{
  res.status(200).send(req.product)
})

module.exports = router;