const express = require('express');

const router = express.Router();

const groupController = require('../controllers/groupUsers');

router.post('/addUser',groupController.addUserToGroup);
router.get('/listOfAllUsers',groupController.fetchAllUsers);
router.get('/listOfGroupUsers/:groupId/',groupController.fetchAllGroupMembers);
router.delete('/removeUserFromGroup/:groupId/:adminId',groupController.deleteUser);


module.exports = router;