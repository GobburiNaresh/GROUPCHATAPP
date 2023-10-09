const Message = require('../models/messages');
const User = require('../models/userDetails');
const Group = require('../models/group');
const groupMessages = require('../models/groupMessages');
const {sequelize} = require('../util/database');
const jwt = require('jsonwebtoken');


const addGroupMessages = async function (req, res) {
    console.log(req.body);
    const { message, userId, groupId } = req.body;
    console.log(message);
    console.log(userId);
    console.log(groupId);
    const io = req.app.get('io');
    try {
        const result = await groupMessages.create({ message: message, groupGroupId: groupId,userListUserId: userId,userDetailId: userId})
        console.log("result after saving group message", result);
        const nameAndId = await User.findOne({where:{
            id:userId,
        }})
        console.log('nameandId>>',nameAndId);
        io.emit('recieve-group-message', {result,nameAndId});
        // const token = generateAccessToken(result.userId,result.message);
        // console.log(">>>>>>",token);
        res.status(200).json({ result});
    } catch (error) {
        res.status(400).json({ message: "error while saving group message" })
        console.log("error while saving message", error);
    }
}
// function generateAccessToken(id, name) {
//     return jwt.sign({ userId: id, name: name },process.env.SECRET_KEY); 
//   }
const fetchGroupMessages = async function (req, res) {
    const { groupid } = req.body;
    console.log('req.body',req.body);
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
        res.status(500).json({ message: 'error fetching group messages' });
    }
}

const newGroupMessage = async (req, res) => {
    try {
        // Parse the parameters from the request URL
        const groupMessage = parseInt(req.params.groupMessage);
        console.log('groupMessage',groupMessage);
        const groupId = parseInt(req.params.groupId);

        // Ensure that the parameters are valid numbers
        if (isNaN(groupMessage) || isNaN(groupId)) {
            return res.status(400).json({ error: "Invalid parameters" });
        }

        // Retrieve new group messages
        const newGroupMessages = await groupMessages.findAll({
            where: {
                groupGroupId: groupId,
                id: groupMessage 
            },
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ]
        });

        console.log('messages',newGroupMessages);
        res.status(200).json({ messages: newGroupMessages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = {
    addGroupMessages,
    fetchGroupMessages,
    newGroupMessage
}