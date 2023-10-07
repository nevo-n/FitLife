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

async function updateUser(user) {
    const updatedFields = {
        fname: user.fname, 
        lname: user.lname, 
        password: user.password, 
        date_of_birth: user.date_of_birth, 
        type: user.type
    };

    const new_user = await User.findOneAndUpdate({ email: user.email }, updatedFields, { new: true });
    return new_user;
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

async function unfollowEmail(email, unfollowEmail){
    const user = await User.findOne({ email: email });
    const unfollowUser = await User.findOne({ email: unfollowEmail });
    const index = user.following.indexOf(unfollowUser._id);
    if (index > -1) {
        user.following.splice(index, 1);
        await user.save();
        return true; // Successfully unfollowed
    }
    return false
}

module.exports = { createUser, fetchUser, updateUser, deleteUser, listFollowing, listFollowers, unfollowEmail}