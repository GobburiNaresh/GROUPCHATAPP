const express = require('express');

const router = express.Router();

const userController = require('../controllers/messages');
const msgAuth = require('../middleware/auth');

router.post('/message',msgAuth.authenticate,userController.postMessage);
router.get('/getmessages',msgAuth.authenticate,userController.getMessage);


module.exports = router;