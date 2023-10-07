const User = require("../models/user");

async function loginUser(email, password) {
    const user = await User.findOne({ email, password });
    return user != null
}

async function registerUser(fname, lname, email, password, date_of_birth, type) {
    console.log(`loginUser email: ${email} password: ${password}`)

    const user = new User({
        fname: fname,
        lname: lname,
        email: email,
        password: password,
        date_of_birth: date_of_birth,
        type: type,
        status: 'Active',
        followers: [],
        following: [],
        posts: [],
        groups: []
    });
      
    await user.save();  
}


module.exports = { loginUser, registerUser }