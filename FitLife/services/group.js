const Group = require("../models/group")
const UserService = require("../services/user")

async function searchGroup(text){
    return null
}

async function addPost(groupId, postId){
    const group = await Group.findOne({_id: groupId})
    group.posts.push(postId)
    await group.save()
    return group
}

async function createGroup(email, groupDetails){
    const user = await UserService.fetchUser(email)
    const group = new Group({
        creator: user._id,
        name : groupDetails.name,
        description: groupDetails.description,
        tags: groupDetails.tags,
        friends :[user._id],
        posts : []
    })
    let newGroup = await group.save()
    user.groups.push(newGroup._id)
    await user.save()
    return newGroup
}

async function getGroup(groupId, userId){
    const group = await Group.findOne({ _id: groupId })
    .populate({
        path: 'posts',
        model: 'Post',
        populate: [
            {
                path: 'author',
                model: 'User'
            },
            {
                path: 'comments.user_id',
                model: 'User'
            }
        ]
    })
    .populate('friends')
    .populate('creator');

    group.posts.forEach((post) => {
        if(post.likes.includes(userId)){
            post.liked = true
        }
        else {
            post.liked = false
        }
    })

    return group
}

async function editGroup(groupDetails){
    const group = await Group.findOne({ _id: groupDetails.groupId })
    group.name = groupDetails.name
    group.description = groupDetails.description
    group.tags = groupDetails.tags
    return await group.save()
}

module.exports = {
    searchGroup, 
    addPost,
    createGroup,
    getGroup,
    editGroup
}

//http://localhost:8800/group/show/65251c03626739fda083afc7