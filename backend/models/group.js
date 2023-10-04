const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Groups = sequelize.define('groups', {
    groupId: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    group_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    adminId: {
        type: Sequelize.INTEGER,
        allowNull: true,
    }
});


module.exports = Groups;
