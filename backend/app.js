const express = require("express");
const app = express();
exports.app = app;

const bodyParser = require("body-parser");
const path = require('path');

const multer = require('multer');
const upload = multer();

const CronJob = require('cron').CronJob;

const sequelize = require('./util/database');

const User = require('./models/userDetails');
const Message = require('./models/messages')
const Group = require('./models/group');
const userGroups = require('./models/userGroups');
const groupMessages = require('./models/groupMessages');
const Files = require('./models/shareFiles');
const Forgotpassword = require('./models/password')

var cors = require('cors');
app.use(cors({origin: "*"}));

const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require('./routes/signup');
const messageRoutes = require('./routes/messages');
const groupRoutes = require('./routes/group');
const groupUserRoutes = require('./routes/groupUsers');
const passwordRoutes = require('./routes/password');
app.use('/file', upload.single('myfile'), fileRoutes)

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, `${req.url}`));
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user',userRoutes);
app.use('/user',messageRoutes);
app.use('/group',groupRoutes);
app.use('/groupuser',groupUserRoutes);
app.use('/file',fileRoutes);
app.use('/password', passwordRoutes);


User.hasMany(Message,{ foreignKey: 'userId'})
Message.belongsTo(User,{ foreignKey: 'userId'})

userGroups.belongsTo(User, { foreignKey: 'userListUserId' });
userGroups.belongsTo(Group, { foreignKey: 'groupGroupId' });


User.belongsToMany(Group, {through:userGroups,as: 'group',foreignKey: 'userListUserId'} );
Group.belongsToMany(User, {through:userGroups, as: 'users', foreignKey: 'groupGroupId'});

groupMessages.belongsTo(User);

Group.hasMany(Files);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);



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
  new CronJob('0 0 * * *', async function() {
    const chats = await Message.findAll();
    console.log('daily chat',chats);

    for(const chat of chats) {
        await Archieve.create({ groupId: chat.groupId, userId: chat.userId, message: chat.message })
        console.log('id',chat.id)
        await Message.destroy({where: {id: chat.id} })
    }
  },
  null,
  true,
  )

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

// const io = require("socket.io")(3000,{
//   cors: {
//     origin: ['http://localhost:3000']
//   }
// })

// io.on("connection", socket => {
//   console.log(socket.id);
// })