// server.js
const express = require("express");
const connectDB = require("./db");
// const bodyParser = require("body-parser");
require("dotenv").config();

const hostname = "127.0.0.1";
const app = express();
// app.use(bodyParser.json());

(async () => {
  console.log(process.env.MONGO_URI)
  const db = await connectDB();
  // app.locals.db = db; // Store the database connection in app.locals

  const port = process.env.PORT || 3000;
  app.listen(port, () =>
  {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
})();