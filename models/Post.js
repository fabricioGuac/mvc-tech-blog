const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {}

Post.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
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
    modelName: 'post',
}
)

module.exports = Post;
// title, contents, post creator’s