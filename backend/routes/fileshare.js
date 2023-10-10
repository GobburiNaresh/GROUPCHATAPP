const express = require('express');
const router = express.Router();

const filecontroller = require('../controllers/files');
const authenticator = require('../middleware/auth');

router.post('/filestored/:groupId', authenticator.authenticate, filecontroller.downloadFiles)

module.exports = router;