const express = require('express');

const router = express.Router();

const groupMessageController = require('../controllers/groupMessages');

router.post('/addgroupMessage', groupMessageController.addGroupMessages);
router.get('/fetchgroupMessage', groupMessageController.fetchGroupMessages);


module.routes = router;
