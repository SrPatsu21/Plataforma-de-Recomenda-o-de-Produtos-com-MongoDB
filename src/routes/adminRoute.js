const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("./authentication")

//* get admin page html
router.get('/register_product', isAuthenticated, (req, res) =>{
    const title = 'Register Product';
    const post_destiny = '/products/';
    res.render('./admin/create_product', {title, post_destiny},);
  });

router.get('/register_user', isAuthenticated, (req, res) =>{
    const title = 'Register User';
    const post_destiny = '/register/';
    res.render('./admin/create_user', {title, post_destiny},);
})
module.exports = router;