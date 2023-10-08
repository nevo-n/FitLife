const GroupService = require("../services/group")
const SearchService = require("../services/search")

async function searchUser(text, email) { 
    const users = await SearchService.searchUser(text, email)
    return users
}

async function searchGroup(text) { 
    const groups = await GroupService.searchGroup(text)
    return groups
}



module.exports = {searchUser, searchGroup}