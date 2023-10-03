const Message = require('../models/messages');
const User = require('../models/userDetails');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken');

const postMessage = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { message} = req.body.message;
    console.log('id>>a>>', req.user.id);
    const data = await Message.create({ message: message,userId:req.user.id }, { transaction: t });
    
    console.log('data>>', data);
    await t.commit();
    const user = await User.findByPk(data.userId);
    console.log(user);
    res.status(200).json({ newMessage: [data], user: user, token: generateAccessToken(data.userId, data.message) });
  } catch (err) {
    await t.rollback();
    console.error('Error posting message:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name },process.env.SECRET_KEY); 
}

const getMessage = async (req, res, next) => {
  try {
    const msgId = req.query.messageid;
    if (msgId == undefined || msgId == null) {
      const message = await Message.findAll();
      res.status(200).json({ allMessage: message, success: true });
    } else {
      const message = await Message.findAll();
      const message10 = [];
      let msgcount = 0;
      for (let i = message.length - 1; i >= 0; i--) {
        if (msgcount == 10)
          break;
        message10.unshift(message[i]);
        msgcount++;
      }
      res.status(200).json({ allMessage: message10, success: true });
    }
  } catch (err) {
    console.error('Failed to get messages:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  postMessage,
  getMessage,
}