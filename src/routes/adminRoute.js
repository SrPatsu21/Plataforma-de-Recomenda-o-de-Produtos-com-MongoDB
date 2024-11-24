const express = require('express');
const router = express.Router();
const { isAdmin } = require("./authentication")
const {createProduct, searchProduct, deleteProduct} = require('../models/Products')
const {uploadImage} = require('../models/Images');
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


const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/register_product', isAdmin, upload.single('image'), uploadImage, createProduct,
  (req, res) => {
    res.status(201).redirect('/admin/list_products'); // Return to list
  });

//* list products
router.get('/list_products', isAdmin, searchProduct, (req, res) =>{
  const title = 'List Products';
  let { name, tag, category } = req.query;
  const img_url = 'https://127.0.0.1:3000/image/'
  if(!name){name = ""};
  if(!tag){tag = ""};
  if(!category){category = ""};
  const products = req.products;
  res.render('./admin/list_products', {title, products, name, tag, category, img_url},);
})

//* delete product
router.delete('/product/:id', isAdmin, deleteProduct, (req, res) =>{
  res.status(200).send(req.product)
})

//* update
router.get('/edit_product/:id', isAdmin, (req, res) =>{
  const title = 'Edit Product';
  const put_destiny = '/admin/register_product/';
  res.render('./admin/edit_product', {title, put_destiny},);
});

module.exports = router;