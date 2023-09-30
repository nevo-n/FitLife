const User = require("../models/User");

async function login(username, password) {
    const user = await User.findOne({ username, password });
    return user != null
}

async function register(username, password) {

    const user = new User({
        username,
        password
    });

    await user.save()        
}

module.exports = { login, register }