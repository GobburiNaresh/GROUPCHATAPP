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
const messageRoutes = require('./routes/messages');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user',userRoutes);
app.use('/user',messageRoutes);

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });


sequelize
  .sync()
  .then(result => {
    app.listen(process.env.PORT);
  })
  .catch(err => {
    console.log(err);
  });