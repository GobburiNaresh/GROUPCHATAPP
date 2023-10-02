const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require('path');

const sequelize = require('./util/database');

const User = require('./models/userDetails');

var cors = require('cors');
app.use(cors({origin: "*"}));

const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require('./routes/signup');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user',userRoutes);

sequelize
  .sync()
  .then(result => {
    app.listen(process.env.PORT);
  })
  .catch(err => {
    console.log(err);
  });