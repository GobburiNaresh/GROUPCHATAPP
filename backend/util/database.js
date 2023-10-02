const Sequelize = require('sequelize');

const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_ROOT,process.env.DB_PASSWORD,{
    host:process.env.DB_HOST,
    dialect:'mysql'
});



module.exports = sequelize;