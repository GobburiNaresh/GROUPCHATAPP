const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const GroupMessages = sequelize.define('group_messages',{
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    groupGroupId:{
        type:Sequelize.INTEGER
    },
    userListUserId:{
        type:Sequelize.INTEGER
    },
    
},{
    timestamps: false,
})

module.exports = GroupMessages;