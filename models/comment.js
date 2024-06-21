const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date: {
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW,
    },
    post_id:{
        type: DataTypes.UUID,
        allowNull:false,
        references: {
          model: 'post',
          key: 'id',
        },
    },
    user_id:{
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
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
}
)

module.exports = Comment;