const express = require('express');

const router = express.Router();

const groupController = require('../controllers/groupUsers');

router.get('/addUser',groupController.addUserToGroup);
router.get('/listOfAllUsers',groupController.fetchAllUsers);
router.get('/listOfGroupUsers/:groupId/:adminId',groupController.fetchAllGroupMembers);

module.exports = router;