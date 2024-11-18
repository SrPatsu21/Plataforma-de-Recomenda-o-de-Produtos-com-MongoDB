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

// provisory users
//TODO remove provisory users
const users = [
  { id: 1, username: 'user', passwordHash: '$2b$10$c8pCR5Z69zl/tUyEg1Nreu4FEdI/NMvxUYZWaAcsuQ8zH42kfdkSC' }, // password: 123
];

// Local Strategy to authenticate user
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Find user by username
    const user = users.find(user => user.username === username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    // Compare password
    bcrypt.compare(password, user.passwordHash, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  }
));

// store user in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user info from session
passport.deserializeUser((id, done) => {
  const user = users.find(user => user.id === id);
  done(null, user);
});

//* middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).redirect("/login?error=true");
};

module.exports = {
    passport: passport,
    isAuthenticated: isAuthenticated,
    users: users
}