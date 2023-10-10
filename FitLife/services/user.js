const User = require("../models/user");

async function createUser(fname, lname, email, password, date_of_birth, type) {    
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return false;
    }

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
    const user = await User.findOne({ email: email }).populate({
        path: 'groups',
        model: 'Group'
    })
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
    const updatedUser = await User.findOneAndUpdate({ email: email }, { status: 'Disabled' }, { new: true });
    if (!updatedUser) {
        return false;
    }
    return true;
}

async function listFollowing(email){
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
    const user = await User.findOne({ email: email })
    const unfollowUser = await User.findOne({ email: unfollowEmail })
    
    const followingIndex = user.following.indexOf(unfollowUser._id)
    user.following.splice(followingIndex, 1);

    const followerIndex = unfollowUser.following.indexOf(user._id)
    unfollowUser.followers.splice(followerIndex, 1)

    await user.save();
    await unfollowUser.save();
    return true
}

async function followEmail(email, followEmail){
    const user = await User.findOne({ email: email })
    const follow = await User.findOne({email: followEmail})
    user.following.push(follow._id)
    follow.followers.push(user._id)
    await user.save()
    await follow.save()
    return true
}

async function searchUser(text){
    const regex = new RegExp(text, 'i')
    const users = await User.find({$or: [
        {email: regex},
        {fname: regex},
        {lname: regex},
        {type: regex}
    ]});
    return users
}

async function addPostToUser(postId, email){
    const user = await User.findOne({email: email })
    user.posts.push(postId)
    await user.save()
    return user;
}

module.exports = { 
    createUser,
    fetchUser, 
    updateUser, 
    deleteUser, 
    listFollowing, 
    listFollowers, 
    unfollowEmail, 
    followEmail, 
    searchUser,
    addPostToUser
}