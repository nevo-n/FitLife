const UserService = require("../services/user")
const GroupService = require("../services/group")
const PostService = require("../services/post")

// TODO: implement this
async function createGroup(email, groupDetails){
    return {}
}

// TODO: implement this
async function editGroup(groupDetails){
    return {}
}

// TODO: implement this
async function deleteGroup(groupDetails){
    return true
}

// TODO: implement this
async function listGroups(groupDetails){
    return []
}

// TODO: implement this
async function getGroupMembers(groupDetails){
    return []
}

// TODO: implement this
async function getGroupOwner(groupDetails){
    return {}
}

// TODO: implement this
async function listGroupByOwnerEmail(groupDetails){

}

module.exports = {createGroup, editGroup, deleteGroup, listGroups, getGroupMembers ,getGroupOwner, listGroupByOwnerEmail}


