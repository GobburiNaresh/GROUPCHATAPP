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
    const groupId = req.params.groupId;

    try {
        const result = await userGroups.findAll({
            where: {
                groupGroupId: groupId,
            },
            include:{
                model:User,
                attributes:['name', 'email', 'id']
            }
        });
        const membersWithEmailOnly = result
        .filter((userGroup) => userGroup.user_detail && userGroup.user_detail.email)
        .map((userGroup) => ({
            email: userGroup.user_detail.email,
        }));
        console.log('membersWithEmailOnly',membersWithEmailOnly)
       res.status(200).json({ result: membersWithEmailOnly  });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteUser = async function (req,res)  {
    const groupId = req.params.groupId;
    const adminId = req.params.adminId;
    try{
        const deleteuser = await userGroups.destroy({
            where: {
              groupGroupId: groupId,
              userListUserId: adminId
            }
        });
        console.log('deleteUser',deleteuser)
        res.status(200).json({ deleteuser,message: 'User removed from group successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
    


module.exports = {
    addUserToGroup,
    fetchAllUsers,
    fetchAllGroupMembers,
    deleteUser

}