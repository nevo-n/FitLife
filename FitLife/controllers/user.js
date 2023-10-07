const PostService = require("../services/post")
const UserService = require("../services/user")

async function feed(email) { 
    const user = await UserService.fetchUser(email)
    const followingPosts =  await PostService.fetchUserFeedPosts(user)
    const data = {
        user: user,
        followingPosts: followingPosts
    }
    // console.log(data)
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

module.exports = {feed, followings, followers, unfollow}