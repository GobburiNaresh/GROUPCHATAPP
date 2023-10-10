const Message = require('../models/messages');
const User = require('../models/userDetails');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');

const secret_key=process.env.SECRET_KEY

const postMessage = async (req, res, next) => {
  try {
    const message = req.body.message.message;
    const token = req.body.message.token;
    console.log("req.body",req.body);
    console.log('token', token);
    const io = req.app.get('io');
    jwt.verify(token, secret_key, async (err, decoded) => {
      if (err) {
          console.error("JWT verification error:", err);
          res.status(401).json({ error: 'Unauthorized' });
      } else {
          console.log("decoded key", decoded.userId);
          const data = await Message.create({ message: message,userId: decoded.userId });
          const nameAndId = await User.findOne({where:
              {
              id:decoded.userId
              }
          })
        console.log('nameAndId',nameAndId);
        console.log('data',data);
        io.emit('recieve-message', {data,nameAndId});
        res.status(200).json({ newMessage: data});
        }
      });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
const getMessage = async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          attribute: ['name'],
        },
      ],
    });
    console.log(messages);
    res.status(200).json({ allMessage: messages, success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

 const allMessage = async function (req, res) {
  let messageId = req.params.id;
  try {
      const newMessages = await Message.findAll({
          where: {
              id: {
                  [sequelize.Op.gt]: messageId
              }
          }
      })
      res.status(200).json({ newMessages });
      console.log(newMessages);
  }
  catch (error) {
      console.log(error);
  }
}

module.exports = {
  postMessage,
  getMessage,
  allMessage
}