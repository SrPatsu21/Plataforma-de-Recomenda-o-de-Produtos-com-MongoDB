const express = require('express');
const router = express.Router();
const { isAdmin } = require("./authentication")
const {createProduct, searchProduct, deleteProduct, getProductById, updateProduct} = require('../models/Products')
const {uploadImage, updateImage} = require('../models/Images');
const {searchUsers, deleteUser} = require('../models/Users');
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
  if(!name){name = ""};
  if(!tag){tag = ""};
  if(!category){category = ""};
  const products = req.products;
  res.render('./admin/list_products', {title, products, name, tag, category},);
})

//* delete product
//soft delete, img not deleted too
router.delete('/product/:id', isAdmin, deleteProduct, (req, res) =>{
  res.status(200).send(req.product)
})

//* update product
router.get('/edit_product/:id', isAdmin, getProductById, (req, res) =>{
  const product = req.product;
  const title = 'Edit Product';
  const post_destiny = '/admin/edit_product/';
  res.render('./admin/edit_product', {title, post_destiny, product},);
});

//? post because the image that need to be uploaded and i dont know why dont work with put
router.post('/edit_product', isAdmin, upload.single('image'), updateImage, updateProduct,  (req, res) =>{
  res.status(200).redirect('/admin/list_products');
})

//* list user
router.get('/list_users',isAdmin, searchUsers, (req, res) =>{
  const title = 'List Users';
  let { username } = req.query;
  if(!username){username = ""};
  const users = req.users;
  res.render('./admin/list_users', {title, users, username},);
});

//* delete user
router.delete('/user/:id', isAdmin, deleteUser, (req, res) =>{
  res.status(200).send(req.user)
})

module.exports = router;