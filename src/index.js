const port = 2924;
const express = require('express');
const app = express();


app.use(express.json());

const userController = require('./controller/user.controller');
const postController = require('./controller/post.controller');
app.use("/users",userController);
app.use("/posts",postController);

module.exports = {
    port,
    app
}

