const express = require('express');
const connectDB = require('./db');
const path = require('path')
require('dotenv').config();

//* global var
const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

connectDB();

//? Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* authentication
const expressSession = require('express-session');
const { passport } = require("./routes/authentication")
app.use(expressSession({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


//* Serve css static files
app.use(express.static(path.join(__dirname, "public")));

//* views
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/*
* START ROUTES
*/
//* favicon
const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, '/views/static/favicon/favicon.ico')));

//* login route
const userRoute = require('./routes/userRoute');

app.use('', userRoute);

//* admin route
const adminRoute = require('./routes/adminRoute');

app.use('/admin', adminRoute)

//* Products route
const productRoute = require('./routes/productRoute');

app.use('/products', productRoute);

//* server loop
app.listen(port, () => {
  console.log(
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n-------------------------------------------------------------------------------------------------------------------------------\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n"
  );
  console.log(`Server is running on http://${hostname}:${port}`);
});