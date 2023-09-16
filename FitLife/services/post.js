const Post = require("../models/post");

async function add_post(title, content, username) {

    const post = new Post({
        title: title,
        content: content,
        username: username
    });

    await post.save()        
}

module.exports = { add_post }