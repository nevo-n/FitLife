const user = require("../models/user");
const User = require("../models/user");

async function createUser(fname, lname, email, password, date_of_birth, type) {
    console.log(`createUser email: ${email} password: ${password}`)
    
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return false;
    }

    // Create new user
    const user = new User({
        fname: fname,
        lname: lname,
        email: email,
        password: password,
        date_of_birth: date_of_birth,
        type: type,
        status: 'Active'
    });

    await user.save();
    return user;
}

async function fetchUser(email) {
    const user = await User.findOne({ email: email })
    return user
}

async function editUser(fname, lname, email, password, date_of_birth, type) {
    console.log(`editUser email: ${email} password: ${password}`)
    const updatedFields = {
        fname: fname, 
        lname: lname, 
        password: password, 
        date_of_birth: date_of_birth, 
        type: type
    };
    // Find user and update the password
    const user = await User.findOneAndUpdate({ email: email }, updatedFields, { new: true });
    if (!user) {
        return false;
    }
    return user;
}

async function deleteUser(email) {
    console.log(`deleteUser email: ${email}`)
    const updatedUser = await User.findOneAndUpdate({ email: email }, { status: 'Disabled' }, { new: true });
    if (!updatedUser) {
        return false;
    }
    return true;
}

async function listFollowing(email){
    console.log(`listFollwings email: ${email}`)
    const user = await User.findOne({ email: email });
    const followingUsers = await User.find({ _id: { $in: user.following } });
    return followingUsers;
}

async function listFollowers(email){
    console.log(`listFollwings email: ${email}`)
    const user = await User.findOne({ email: email });
    const followersUsers = await User.find({ _id: { $in: user.followers } });
    return followersUsers;
}


module.exports = { createUser, fetchUser, editUser, deleteUser, listFollowing, listFollowers}