const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserGroups = sequelize.define('user_groups', {
    userListUserId:{
        type:Sequelize.INTEGER
    },
    groupGroupId:{
        type:Sequelize.INTEGER
    }
});


module.exports = UserGroups;