const express = require("express");
const app = express();
exports.app = app;

const bodyParser = require("body-parser");
const path = require('path');

const sequelize = require('./util/database');

const User = require('./models/userDetails');
const Message = require('./models/messages')
const Group = require('./models/group');
const userGroups = require('./models/userGroups');
const groupMessages = require('./models/groupMessages');

var cors = require('cors');
app.use(cors({origin: "*"}));

const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require('./routes/signup');
const messageRoutes = require('./routes/messages');
const groupRoutes = require('./routes/group');
const groupUserRoutes = require('./routes/groupUsers');
const groupMessageRoutes = require('./routes/groupUsers');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user',userRoutes);
app.use('/user',messageRoutes);
app.use('/group',groupRoutes);
app.use('/groupuser',groupUserRoutes);
app.use('/groupMessage',groupMessageRoutes);

User.hasMany(Message,{ foreignKey: 'userId'})
Message.belongsTo(User,{ foreignKey: 'userId'})

userGroups.belongsTo(User, { foreignKey: 'userListUserId' });
userGroups.belongsTo(Group, { foreignKey: 'groupGroupId' });


User.belongsToMany(Group, {through:userGroups,as: 'group',foreignKey: 'userListUserId'} );
Group.belongsToMany(User, {through:userGroups, as: 'users', foreignKey: 'groupGroupId'});



sequelize
  .sync({force:false})
  .then(result => {
    app.listen(process.env.PORT);
  })
  .catch(err => {
    console.log(err);
  });