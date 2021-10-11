const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title : {type : String, required: true},
    body : {type : String, required: true},
    user : {type : mongoose.Types.ObjectId, ref : "user" , required: true}
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;