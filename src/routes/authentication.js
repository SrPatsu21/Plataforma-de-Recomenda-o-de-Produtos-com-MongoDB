//https://www.geeksforgeeks.org/authentication-strategies-available-in-express/
//https://www.passportjs.org/packages/passport-local/

/*
* if u just want to force the authentication, use "authenticate" inside the route (get, post, etc.)
*
* if u want something different, u need to import the passport and do by your self
*/

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Users = require('../models/Users').Users;


// Local Strategy to authenticate user
passport.use(new LocalStrategy(
  async (username, password, done) => {
    // Find user by username
    const user = await Users.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
    });
  }
));

// store user in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user info from session
passport.deserializeUser(async(id, done) => {
  const user = await Users.findOne({ _id: id });
  done(null, user);
});

//* middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).redirect("/login?error=true");
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
  }
  res.status(403).send('Access Denied: Admins Only');
};

module.exports = {
    passport: passport,
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin
}