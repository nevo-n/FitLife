const Post = require("../models/post");
const User = require("../models/user");
const Group = require("../models/group")

async function fetchUserFeedPosts(user) {
    const lastDayDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours
    const userGroups = await Group.find({ friends: user._id });
    const groupPostIds = userGroups.reduce((acc, group) => acc.concat(group.posts), []);
    const posts = await Post.find({
        $or: [
            { author: { $in: user.following } },
            { _id: { $in: groupPostIds } }
        ],
        created_on: { $gte: lastDayDate }
    })
    .populate('author', 'email')
    .sort({ created_on: -1 })
    .exec();
    return posts;
}

module.exports = { fetchUserFeedPosts }