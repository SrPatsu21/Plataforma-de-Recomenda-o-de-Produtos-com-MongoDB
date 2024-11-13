const express = require("express");
const connectDB = require("./db");
require("dotenv").config();

//* global var
const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

connectDB();

//* authentication
//https://www.geeksforgeeks.org/authentication-strategies-available-in-express/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// provisory users
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Local Strategy to authenticate user
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = users.find(user => user.username === username);

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    // password validation
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    // deserialize user info from session
    return done(null, user);
  }
));

// serialize user info into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user info from session
passport.deserializeUser((id, done) => {
  const user = users.find(user => user.id === id);
  done(null, user);
});

app.use(require('express-session')({ secret: 'secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

//* Products route
const Products = require('./models/Products')

// if needed   res.redirect('/new-route');

// Create a Products route
//*
/*
curl -X POST http://localhost:3000/Product \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Product",
    "category": "Electronics",
    "tags": ["new", "popular", "sale"],
    "price": 99.99,
    "rating": 4.5
  }'
*/
//*
app.post('/Products', async (req, res) => {
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
});

// select
app.get('/Products', passport.authenticate('local', { session: false }), async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products); // Return the list of matching products
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//* server loop
app.listen(port, () => {
  console.log(
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n-------------------------------------------------------------------------------------------------------------------------------\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n"
  );
  console.log(`Server is running on http://${hostname}:${port}`);
});