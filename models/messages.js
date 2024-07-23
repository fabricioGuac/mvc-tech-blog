const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/connection');


class Message extends Model {}

Message.init({
    id:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    content:{
        type: DataTypes.TEXT,
        allowNull:false,
    },
    sender_id:{
        type: DataTypes.UUID,
        allowNull:false,
        references: {
          model: 'user',
          key: 'id',
        },
    },
    receiver_id:{
        type: DataTypes.UUID,
        allowNull:false,
        references: {
          model: 'user',
          key: 'id',
        },
    }
},
{
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'message',
})

module.exports = Message