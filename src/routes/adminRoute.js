const express = require('express');
const router = express.Router();
const { isAdmin } = require("./authentication")
const Products = require('../models/Products')



//* get admin page html
router.get('/', isAdmin, (req, res) =>{
  const title = 'Admin main';
  res.render('./admin/layout_adm', {title},);
});

router.get('/register_product', isAdmin, (req, res) =>{
    const title = 'Register Product';
    const post_destiny = '/products/';
    res.render('./admin/create_product', {title, post_destiny},);
  });

router.post('/register_product' ,isAdmin,
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
    res.status(201).redirect('/admin/products'); // Return the newly created Product
    } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
    }
  });

router.get('/products', isAdmin, async(req, res) =>{
  const title = 'List Products';
  try {
      const { name, tag, category } = req.query;
      const query = {};
      if (name) {
          query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
      }
      if (tag) {
          query.tags = { $in: [tag] };
      }
      if (category) {
          query.category = { $regex: category, $options: 'i' };
      }
      const products = await Products.find(query);
      res.render('./admin/list_products', {title, products, name, tag, category},);
    } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
})

router.delete('/products/:id', isAdmin, async(req, res) =>{
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
})

module.exports = router;