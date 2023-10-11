const UserService = require("../services/user")
const GroupService = require("../services/group")

async function searchUser(text, email){
    const users = await UserService.searchUser(text)
    const user = await UserService.fetchUser(email)
    const notMe = users.filter(u => u._id.toString() !== user._id.toString());
    for (let i = 0; i < notMe.length; i++) {
        notMe[i].IFollow = user.following.includes(notMe[i]._id);
    }

    return notMe
}

async function searchGroups(text, email){
    const groups = await GroupService.searchGroups(text)
    const user = await UserService.fetchUser(email)
    for(let i = 0; i < groups.length; i++){
        groups[i].IFollow = user.groups.some(id => id.equals(groups[i]._id));
        groups[i].IOwn = groups[i].creator.equals(user._id)
    }
    return groups
}

module.exports = {searchUser, searchGroups}