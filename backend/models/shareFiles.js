const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const StoredFile = sequelize.define('file', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    url:Sequelize.STRING
})

module.exports = StoredFile;