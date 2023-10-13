const Group = require("../models/group")
const UserService = require("../services/user")

async function searchGroups(text){
    const regex = new RegExp(text, 'i')
    const groups = await Group.find({$or: [
        {name: regex},
        {title: regex},
        {tags: regex},
    ]});
    return groups
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

async function joinGroup(groupId, email){
    const group = await Group.findOne({ _id: groupId })
    const user = await UserService.fetchUser(email)
    if(!group.friends.some(id => id.equals(user._id))){
        group.friends.push(user._id)
        await group.save()
    }
    if(!user.groups.some(id => id.equals(groupId))){
        user.groups.push(groupId)
        await user.save()
    }
    return group
}

async function leaveGroup(groupId, email){
    const group = await Group.findOne({ _id: groupId })
    const user = await UserService.fetchUser(email)
    if(group.friends.some(id => id.equals(user._id))){
        const index = group.friends.indexOf(user._id)
        group.friends.splice(index, 1)
        await group.save()
    }
    if(user.groups.some(id => id.equals(groupId))){
        const index = user.groups.indexOf(groupId)
        user.groups.splice(index, 1)
        await user.save()
    }
    return group
}

module.exports = {
    searchGroups, 
    addPost,
    createGroup,
    getGroup,
    editGroup,
    joinGroup,
    leaveGroup
}
