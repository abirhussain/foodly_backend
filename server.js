const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongo_uri = process.env.MONGO_URI;

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect database
mongoose
  .connect(mongo_uri)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Foodly backend is running on port ${port}`);
});
