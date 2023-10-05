const express = require('express');

const router = express.Router();

const groupController = require('../controllers/createGroup');

router.post('/createGroup', groupController.saveGroupName);
router.get('/fetchGroups/:id', groupController.fetchGroups);


module.exports = router;