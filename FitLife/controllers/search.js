const GroupService = require("../services/group")
const SearchService = require("../services/search")

async function searchUser(text, email) { 
    const users = await SearchService.searchUser(text, email)
    return users
}

async function searchGroups(text, email) { 
    const groups = await SearchService.searchGroups(text, email)
    return groups
}



module.exports = {searchUser, searchGroups}