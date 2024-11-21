const express = require('express');
//TODO remove users and bcrypt
const {passport, users} = require('./authentication');
const bcrypt = require('bcrypt');
const Users = require('../models/Users');

const router = express.Router();

//* display login page
router.get('/login', (req, res) => {
  const error = req.query.error === 'true';
  const title = 'Login';
  res.render('login', {title, error});
});

//* login
//TODO redirect to main page
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
        return res.json({ message: 'Logged in successfully' });
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
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username": "user", "password": "123"}'
*/
router.post('/register', async (req, res) => {
  try {
    const { username, email, pass, lastWords, lastCategories, lastTags } = req.body;
    bcrypt.hash(pass, 10, async (err, hash) => {
      if (err) return res.status(500).json({ message: 'Error hashing password' });
      const password = hash;
      const user = new Users({
        username,
        email,
        password,
        lastSearched: {
          words: lastWords ? lastWords.split(',').map(word => word.trim()) : [],
          categories: lastCategories ? lastCategories.split(',').map(cat => cat.trim()) : [],
          tags: lastTags ? lastTags.split(',').map(tag => tag.trim()) : [],
        },
      });

      await user.save();
      res.redirect('/success');
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
