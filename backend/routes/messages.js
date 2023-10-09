const express = require('express');

const router = express.Router();

const messageController = require('../controllers/messages');
const msgAuth = require('../middleware/auth');
const groupMessageController = require('../controllers/groupMessages');

router.post('/groupMessage/addgroupMessage', groupMessageController.addGroupMessages);
router.get('/groupMessage/fetchgroupMessage', groupMessageController.fetchGroupMessages);
router.get('/groupMessage/newGroupMessages/:groupMessage/:groupId',groupMessageController.newGroupMessage);


router.post('/message',msgAuth.authenticate,messageController.postMessage);
router.get('/getmessages',msgAuth.authenticate,messageController.getMessage);
router.get('/allMessages/:id',msgAuth.authenticate, messageController.allMessage);


module.exports = router;