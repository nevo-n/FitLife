const UserService = require("../services/user")

async function searchUser(text, email){
    const users = await UserService.searchUser(text)
    const user = await UserService.fetchUser(email)
    const notMe = users.filter(u => u._id.toString() !== user._id.toString());
    for (let i = 0; i < notMe.length; i++) {
        notMe[i].IFollow = user.following.includes(notMe[i]._id);
    }

    return notMe
}

module.exports = {searchUser}