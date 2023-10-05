const Message = require('../models/messages');
const User = require('../models/userDetails');
const Group = require('../models/group');
const groupMessages = require('../models/groupMessages');
const sequelize = require('../util/database');


const addGroupMessages = async function (req, res) {
    console.log(req.body);
    const { message, userId, groupId } = req.body;
    console.log(message);
    console.log(userId);
    console.log(groupId);
    try {
        const result = await groupMessages.create({ message: message, groupGorupId: groupId, userListUserId: userId })
        console.log("result after saving group message", result);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: "error while saving group message" })
        console.log("error while saving message", error);
    }
}

const fetchGroupMessages = async function (req, res) {
    console.log(req.headers)
    const { groupid } = req.body;
    console.log("group id", groupid)
    try {
        const result = await groupMessages.findAll({
            where: {
                groupGroupId: groupid
            },include: {
                model: User,
                attributes: ['name'],
            }
        });
        console.log("r-----",result)
        res.status(200).json(result);
    } catch (error) {
        console.log('error', error);
        res.status(200).json({ message: 'error fetching group messages' });
    }
}


module.exports = {
    addGroupMessages,
    fetchGroupMessages,
}