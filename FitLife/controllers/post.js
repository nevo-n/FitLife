const postService = require("../services/post")
const UserService = require("../services/user")

// TODO: implement this
async function getPostsByEmail(email, data){
    // should return all posts by email from 'date' till today
    // if data = null or undefined then return all posts from that email
    return []
}

// TODO: implement this
async function getPostsByGroup(groupId, data){
    // should return all posts by email from 'date' till today
    // if data = null or undefined then return all posts from that group
    return []
}

// TODO: implement this
async function getPostsByListOfEmails(emailsList, date){
    // should return all posts by email from 'date' till today
    // if data = null or undefined then return all posts from each email in 'emailsList'
    return []
}

// TODO: implement this (postDetails include info about the creator and context - maybe in group)
async function createPost(postDetails){
    // make sure that you add the post ID to both user and group if needed
    return
}

// TODO: implement this (postDetails include info about the creator and context - maybe in group)
async function deletePost(postDetails){
    // make sure that you rmove post ID from both user and group id needed
    return
}

// TODO: implement this (postDetails include info about the creator and context - maybe in group)
async function editPost(email, postDetails){
    // edit post details here 
    return
}

// TODO: implement this
async function getPost(postId){
    return
}

module.exports = {getPostsByEmail, getPostsByGroup, getPostsByListOfEmails, createPost, deletePost, editPost, getPost}





