const postService = require("../service/post")

function add_post(req, res){
    res.render("add_post", {username: req.session.username})
}