const UserService = require("../services/user")
const GroupService = require("../services/group")
const PostService = require("../services/post")

async function createGroup(email, groupDetails){
    const newGroup = await GroupService.createGroup(email, groupDetails)
    return newGroup
}

async function editGroup(groupDetails){
    const group = await GroupService.editGroup(groupDetails)
    return group
}

async function getGroup(groupId, userId){
    const group = await GroupService.getGroup(groupId, userId)
    return group
}

async function createPost(postDetails, groupId){
    const post = await PostService.createPost(postDetails, groupId)
    return post
}

async function joinGroup(groupId, email){
    const group = await GroupService.joinGroup(groupId, email)
    return group
}

async function leaveGroup(groupId, email){
    const group = await GroupService.leaveGroup(groupId, email)
    return group
}

module.exports = {
    createGroup, 
    editGroup, 
    getGroup,
    createPost,
    joinGroup,
    leaveGroup
}


