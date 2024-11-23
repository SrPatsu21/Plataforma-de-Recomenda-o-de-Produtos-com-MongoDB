const express = require('express');
const router = express.Router();
const { isAdmin } = require("./authentication")


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

module.exports = router;