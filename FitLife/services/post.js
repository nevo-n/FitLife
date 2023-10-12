const Post = require("../models/post")
const Group = require("../models/group")
const UserService = require("../services/user")
const GroupService = require("../services/group")

async function fetchUserFeedPosts(user) {
    const lastDayDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours
    const userGroups = await Group.find({ friends: user._id });
    const groupPostIds = userGroups.reduce((acc, group) => acc.concat(group.posts), []);
    const posts = await Post.find({
        $or: [
            { author: { $in: user.following } },
            { author: user._id},
            { _id: { $in: groupPostIds } }
        ],
        created_on: { $gte: lastDayDate }
    })
    .populate('author', 'email')
    .populate('comments.user_id', 'email')
    .sort({ created_on: -1 })
    .exec();
    posts.forEach((post) => {
        if(post.likes.includes(user._id)){
            post.liked = true
        }
        else {
            post.liked = false
        }
    })
    return posts;
}

async function fetchPostsByEmail(email, days = 7, shouldPopulate = false){
    const user = await UserService.fetchUser(email)
    const dateSinceDays = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    let posts = null
    if (shouldPopulate){
        posts = await Post.find({
            author: user._id,    
            created_on: { $gte: dateSinceDays }
        })
        .populate('author', 'email')
        .populate('comments.user_id', 'email')
        .sort({ created_on: -1 })
        .exec();

        posts.forEach((post) => {
            if(post.likes.includes(user._id)){
                post.liked = true
            }
            else {
                post.liked = false
            }
        })
    }
    else {
        posts = await Post.find({
            author: user._id,    
            created_on: { $gte: dateSinceDays }
        })
    }

    return posts
}

async function getComments(email, days = 7){
    const user = await UserService.fetchUser(email)
    const dateSinceDays = new Date(Date.now() - days * 24 * 60 * 60 * 1000); 

    const posts = await Post.find({
        "comments.user_id": user._id,
        "comments.created_on": { $gte: dateSinceDays }
    }).exec();

    let comments = {};

    posts.forEach(post => {
        post.comments.forEach(comment => {
            if (comment.user_id.equals(user._id) && comment.created_on >= dateSinceDays) {
                const dateStr = comment.created_on.toISOString().split('T')[0];                
                comments[dateStr] = (comments[dateStr] || 0) + 1;
            }
        });
    });


    return comments;
}

async function createPost(postDetails, groupId){
    const user = await UserService.fetchUser(postDetails.email)
    const post = new Post({
        author: user._id,
        title: postDetails.title,
        content: postDetails.content,
        like: [],
        comments: []
    })
    let newPost = await post.save()
    await UserService.addPostToUser(newPost._id, postDetails.email)
    if(groupId !== null){
        GroupService.addPost(groupId, newPost._id)
    }
    return newPost
}

async function deletePost(postId){
}

async function editPost(postDetails){
    const user = await UserService.fetchUser(postDetails.email)
    const currPost = await Post.findOne({_id: postDetails._id, author: user._id})
    currPost.title = postDetails.title
    currPost.content = postDetails.content
    currPost.save()
    return currPost
}

async function getPost(postId){
    const post = await Post.findOne({_id: postId })
    .populate('author', 'email')
    .exec()
    return post
}

async function addLike(postId, email){
    const user = await UserService.fetchUser(email)
    const post = await Post.findOne({_id: postId })
    post.likes.push(user._id)
    post.save()
    return post
}

async function removeLike(postId, email){
    const user = await UserService.fetchUser(email)
    const post = await Post.findOne({_id: postId })
    const likeIndex = post.likes.indexOf(user._id)
    post.likes.splice(likeIndex, 1)
    post.save()
    return post
}

async function addComment(postId, email, comment){
    const user = await UserService.fetchUser(email)
    const post = await Post.findOne({_id: postId })
    post.comments.push({user_id: user._id, content: comment})
    post.save()
    return post
}

module.exports = { 
    fetchUserFeedPosts,
    fetchPostsByEmail, 
    createPost, 
    deletePost, 
    editPost, 
    getPost, 
    addLike, 
    removeLike,
    addComment,
    getComments
}