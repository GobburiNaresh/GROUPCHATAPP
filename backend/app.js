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



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user',userRoutes);
app.use('/user',messageRoutes);
app.use('/group',groupRoutes);
app.use('/groupuser',groupUserRoutes);


User.hasMany(Message,{ foreignKey: 'userId'})
Message.belongsTo(User,{ foreignKey: 'userId'})

userGroups.belongsTo(User, { foreignKey: 'userListUserId' });
userGroups.belongsTo(Group, { foreignKey: 'groupGroupId' });


User.belongsToMany(Group, {through:userGroups,as: 'group',foreignKey: 'userListUserId'} );
Group.belongsToMany(User, {through:userGroups, as: 'users', foreignKey: 'groupGroupId'});

groupMessages.belongsTo(User);


// const io = require("socket.io")(3000,{
//   cors: {
//     origin: ['http://localhost:3000']
//   }
// })

// io.on("connection", socket => {
//   console.log(socket.id);
// })
sequelize.sync({force:false})
    .then(() => {
        sequelize.options.logging = console.log;
        console.log('Database and tables synced.');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });
const server = app.listen(process.env.PORT,()=>{
  console.log('Server is running on port 3000');
});

const io = require('socket.io')(server,{
  cors:{
      origin: '*'
  }
});

io.on('connection',(socket)=>{
  console.log('user connected');

  socket.on('send-message',(message)=>{
      console.log("message recieved using socket", message);
       io.emit('recieve-message', message);
  })

})
app.set('io', io);

// sequelize
//   .sync({force:false})
//   .then(result => {
//     app.listen(process.env.PORT);
//   })
//   .catch(err => {
//     console.log(err);
//   });