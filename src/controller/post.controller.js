const express = require('express');
const router = express.Router();
const Post = require('../model/post.model');
const authenticate = require('../middleware/authenticate')

router.post("", async(req, res) => {
    try {

        const post = await Post.create(req.body);
        return res.status(201).send(post)
    } catch (err) {
        res.status(500).send(err.message)
    }
});
router.get("/", authenticate, async function (req, res) {
    try {

        const posts = await Post.find().
        populate({
            path :"user",
            select : "name email"
        }).
        lean().exec();
        const user = req.user
    
        return res.status(200).send({posts,user})
    } catch (err) {
        res.status(500).send(err.message)
        
    }
});


module.exports = router;