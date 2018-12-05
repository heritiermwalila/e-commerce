const Sequelize = require('sequelize');
const sequelize = require('../libs/databases');
const Product = sequelize.define('product', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    price:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = Product;