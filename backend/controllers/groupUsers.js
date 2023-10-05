const User = require('../models/userDetails');
const group = require('../models/group');
const userGroups = require('../models/userGroups');
const sequelize = require('../util/database');


const addUserToGroup = async function (req, res) {
    console.log('adduserTOgroup>>>',req.body);
    const { groupId, id } = req.body;
    userListUserId = id;
    groupGroupId = groupId
    try {
        const existingUser = await userGroups.findOne({
            where: {
                userListUserId: id,
                groupGroupId: groupId
            }
        })
        if (!existingUser) {
            const result = await userGroups.create({ userListUserId, groupGroupId });
            res.status(200).json(result);

        } else {
            res.status(201).json({ message: "user already present in the group" })
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'some error happened' });
    }
}

const fetchAllUsers = async function (req, res) {
    // console.log('req reaching the server');

    try {
        const result = await User.findAll({
            attributes: ['name', 'email', 'id'],
        });

        console.log(result);
        res.status(200).json({ result });
    } catch (error) {
        console.log(error);
    }
}

const fetchAllGroupMembers = async function (req, res) {
    const groupId = req.params.groupId; // Extract the 'groupId' from the request parameters

    try {
        const result = await userGroups.findAll({
            where: {
                groupGroupId: groupId 
            },
            include:{
                model:User,
                attributes:['email']
            }
        });
        console.log("(*(*(*(",result)
        res.status(200).json({result});
        // Handle the result, e.g., send it as a response
        // res.json(result);
    } catch (error) {
        console.log(error);
        // Handle the error, e.g., send an error response
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    addUserToGroup,
    fetchAllUsers,
    fetchAllGroupMembers

}