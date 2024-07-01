//  Imports the models
const User = require('./User');
const Post = require('./Post');
const Comment = require('./comment');
const Like = require('./likes');

// Defines the models relations
User.hasMany(Post, {
foreignKey:"user_id",
onDelete:"CASCADE",
});

Post.belongsTo(User, {
foreignKey:"user_id",
});

User.hasMany(Comment,{
    foreignKey:"user_id",
    onDelete:"CASCADE",
})

Post.hasMany(Comment,{
    foreignKey:"post_id",
    onDelete:"CASCADE",
})

Comment.belongsTo(User,{
    foreignKey:"user_id",
})

Comment.belongsTo(Post,{
    foreignKey:"post_id",
})

User.hasMany(Like,{
    foreignKey:"user_id",
    onDelete:"CASCADE",
})

Post.hasMany(Like,{
    foreignKey:"post_id",
    onDelete:"CASCADE",
})

Like.belongsTo(User,{
    foreignKey:"user_id",
})

Like.belongsTo(Post,{
    foreignKey:"post_id",
})

// Exports the models
module.exports = {User, Post, Comment, Like};