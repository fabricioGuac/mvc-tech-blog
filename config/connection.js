// Imports sequelize
const Sequelize = require('sequelize');

// Creates a new sequelize instance
const sequelize = new Sequelize(process.env.POSTGRESURI);

// Exports the sequelize instance
module.exports = sequelize;