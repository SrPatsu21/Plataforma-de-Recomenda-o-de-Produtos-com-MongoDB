const express = require('express');
const {passport, isAuthenticated} = require('./authentication');
const bcrypt = require('bcrypt');
const { Users, updateUser } = require('../models/Users');
const { searchProductsActive, recomendateProduct, saveForUserRecomendation, getProductById } = require('../models/Products');

const router = express.Router();

//* get user page html
router.get('/',recomendateProduct, searchProductsActive, saveForUserRecomendation, (req, res) => {
  const title = "Home";
  let { name, tag, category } = req.query;

  if(!name){name = ""};
  if(!tag){tag = ""};
  if(!category){category = ""};
  const products = req.products;
  const recomendate_products = req.recomendate_products
  const login = req.isAuthenticated();
  res.render("./user/list_products.pug", {title, products, recomendate_products, name, tag, category, login},);
});

router.post('/add-cart/:id', isAuthenticated, getProductById, (req, res) => {
  let cart = req.session.cart || [];
  const product = req.product;
  cart.push(product)
  req.session.cart = cart;
  res.status(200).json({ message: 'add' });
})

router.delete('/rem-cart/:id', isAuthenticated, (req, res) => {
  let cart = req.session.cart || [];
  const newCart = cart.filter(product => product._id !== req.params.id);
  req.session.cart = newCart;
  res.status(200).json({ message: 'rem' });
})

router.get('/product/:id', getProductById, (req, res) => {
  const product = req.product
  const title = req.product.name
  res.render("./user/product.pug", {title, product},);
})

router.get('/cart', isAuthenticated, (req, res) => {
  const title = "cart";
  const products = req.session.cart || [];
  const subtotal = products.reduce((acc, product) => acc + Number(product.price.$numberDecimal), 0);
  const login = req.isAuthenticated();
  res.render("./user/cart.pug", {title, products, subtotal, login},);
})

router.get('/checkout', isAuthenticated, (req, res) => {
  const products = req.session.cart || [];
  const subtotal = products.reduce((acc, product) => acc + Number(product.price.$numberDecimal), 0);
  res.render("./user/checkout.pug", { products, subtotal })
})

//* profile user page
router.get('/profile', isAuthenticated, (req, res) => {
  const title = "Profile";
  const id = req.user._id;
  const name = req.user.username;
  const email = req.user.email;
  const profile_edit = "/profile/profile_edit"
  let message_status = "hidden";

  if (req.query.message) {
    message_status = ""
  } else {
  }
  req.query.message = null;
  const login = req.isAuthenticated();
  res.render("./user/profile.pug", {title, id, name, email, profile_edit, message_status, login},);
})

//* TODO verify inputs
//* edit profile
router.post("/profile/profile_edit", isAuthenticated, updateUser, (req, res) => {
  res.status(200).redirect("/profile?message=show");
})

//* login
router.get('/login', (req, res) => {
  const error = req.query.error === 'true';
  const title = 'Login';
  res.render('./user/login', {title, error});
});

router.post('/login',
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json(info);
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.redirect('/');
      });
    })(req, res, next);
});

//* logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

//* Route to register user, just for test
/*
*
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username": "user", "email@hotmail.com", "password": "12345678"}'
*/
router.get('/register', (req, res) =>{
  const title = 'Register User';
  const post_destiny = '/register/';
  res.render('./user/register', {title, post_destiny},);
})

router.post('/register', async (req, res) => {
  try {
    // const { username, email, pass, lastWords, lastCategories, lastTags } = req.body;
    const { username, email, pass} = req.body;
    const isAdmin = false;
    const active = true;
    bcrypt.hash(pass, 10, async (err, hash) => {
      if (err) return res.status(500).json({ message: 'Error hashing password' });
      const password = hash;
      const user = new Users({
        username,
        email,
        password,
        isAdmin,
        active,
        lastSearched: {
          // words: lastWords ? lastWords.split(',').map(word => word.trim()) : [],
          // categories: lastCategories ? lastCategories.split(',').map(cat => cat.trim()) : [],
          // tags: lastTags ? lastTags.split(',').map(tag => tag.trim()) : [],
        },
      });

      await user.save();
      res.redirect('/login');
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
