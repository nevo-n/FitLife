const PostService = require("../services/post")
const UserService = require("../services/user")

async function feed(email) { 
    const user = await UserService.fetchUser(email)
    const followingPosts =  await PostService.fetchUserFeedPosts(user)
    const data = {
        user: user,
        followingPosts: followingPosts
    }
    return data
}

async function followings(email){
    const users = await UserService.listFollowing(email)
    return users
}

async function followers(email){
    const users = await UserService.listFollowers(email)
    return users
}

async function unfollow(email, unfollowEmail){
    const unfollow = await UserService.unfollowEmail(email, unfollowEmail)
    return unfollow
}

async function follow(email, followEmail){
    const follow = await UserService.followEmail(email, followEmail)
    return follow
}

async function getUser(email){
    const user = await UserService.fetchUser(email)
    return user
}

async function updateUser(user){
    const new_user = await UserService.updateUser(user)
    return new_user
}

async function userFeed(email){
    const userPosts = await PostService.fetchPostsByEmail(email, 356, true)
    return userPosts; 
}

module.exports = {
    feed, 
    followings, 
    followers, 
    unfollow, 
    follow, 
    getUser, 
    updateUser,
    userFeed
}