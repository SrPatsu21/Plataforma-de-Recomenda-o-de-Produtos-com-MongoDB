const express = require('express');
//TODO remove users and bcrypt
const {passport, users} = require('./authentication');
const bcrypt = require('bcrypt');

const router = express.Router();

//* display login page
router.get('/login', (req, res) => {
  // Render login page with any error messages
  const error = req.query.error === 'true'; // Check if error is present in query string
  const data = { title: ''};
  res.render('login', {data, error});
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
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  // Hash the password before saving
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });

    // Save the new user
    const newUser = {
      id: users.length + 1,
      username,
      passwordHash: hash,
    };
    users.push(newUser);

    res.json({ message: 'User registered successfully', passwordHash: hash });
  });
});

module.exports = router;
