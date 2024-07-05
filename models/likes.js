const { Model, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/connection');

class Like extends Model {}

Like.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
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
    modelName: 'like',
}
)

module.exports = Like;