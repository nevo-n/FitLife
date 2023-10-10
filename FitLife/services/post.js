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

async function fetchPostsByEmail(email, date){
    return []
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
    addComment
}