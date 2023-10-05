const Message = require('../models/messages');
const User = require('../models/userDetails');
const Group = require('../models/group');
const UserGroups = require('../models/userGroups');
const sequelize = require('../util/database');

const saveGroupName = async function (req, res) {
    const group_name = req.body.groupName;
    const adminId = req.body.userId;
    try {
        const result = await Group.create({ group_name, adminId });
        const groupGroupId = result.dataValues.groupId;
        const userListUserId = result.dataValues.adminId;
        console.log('groupGroupId',groupGroupId);
        console.log('userListUserId',userListUserId)
        const result2 = await UserGroups.create({ userListUserId, groupGroupId});
        res.status(200).json({ result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const fetchGroups = async function (req, res) {
    try {
        const result = await UserGroups.findAll({
            where: {
                userListUserId: req.params.id
            },
            include: [
                {
                    model: Group,
                    as: 'group',
                    attributes: ['group_name'],
                },
            ],
        });
        const groupNames = result.map(userGroup => userGroup.group.group_name);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const fetchAllUsers = async function (req, res) {
    // console.log('req reaching the server');

    try {
        const result = await User.findAll({
            attributes: ['name', 'email', 'userId'],
        });

        console.log(result);
        res.status(200).json({ result });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    saveGroupName,
    fetchGroups,
    fetchAllUsers
}
