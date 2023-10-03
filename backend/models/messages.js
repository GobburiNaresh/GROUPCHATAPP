const Sequelize = require('sequelize');

const sequelize = require('../util/database');

Message = sequelize.define('user_messages',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
   
    
})

module.exports = Message