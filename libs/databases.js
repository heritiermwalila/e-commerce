const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodejs-db', 'root', '', {
    dialect:'mysql', host:'localhost'
});

module.exports = sequelize;