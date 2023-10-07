const Chat = require('../models/chat');
const mongoose = require('mongoose');


// exports.createChat = async (req, res) => {
//     try {
//         const chat = new Chat(req.body);
//         await chat.save();
//         res.redirect('/chat/' + chat._id); // Redirect to the created chat
//     } catch (error) {
//         res.status(400).send('Error creating chat: ' + error.message);
//     }
// };
// exports.getChat = async (req, res) => {
//     try {
//         const chat = await Chat.findById(req.params.id).populate('messages.sent_by');
//         res.render('chat/view', { chat }); 
//     } catch (error) {
//         res.status(400).send('Error retrieving chat: ' + error.message);
//     }
// };

exports.createMockChat = async (id) => {
    try {
        // Check if a chat with the given ID already exists.
        // const existingChat = await Chat.findById(ObjectId(parseInt(id)));
        // console.log("tried to find by id")
        // if (existingChat) {
        //     throw new Error('Chat with this ID already exists');
        // }

        // Create a new chat with the provided ID.
        const chat = new Chat({
            // _id: mongoose.Types.ObjectId(id),
            // created_on: new Date(),
            type: "Mock chat type",
            // you can also add other fields if needed
        });
        
        await chat.save();
        console.log("Mock chat created successfully!");
    } catch (error) {
        console.error('Error creating mock chat: ', error.message);
    }
};

exports.getMessages = (chatId) => {
   // TODO: replace with fetching messages from the model
    return {
        message: `Messages for chatId ${chatId}.`,
        additionalInfo: "More data can be added here."
    };
};

exports.setMockupMessage = (chatId) => {
    // implement creating mock chat message
}

const User = require('../models/user');
const Group = require('../models/group');
const Post = require('../models/post');

exports.generateMockData = async () => {
    try {
        // Create 4 users, groups, and posts.
        const users = [];
        const groups = [];
        const posts = [];

        for (let i = 1; i <= 4; i++) {
            // Create User
            const user = new User({
                fname: `FirstName${i}`,
                lname: `LastName${i}`,
                email: `user${i}@example.com`,
                password: `password${i}`,
                date_of_birth: new Date(2000 + i, 1, 1),
                type: 'Regular',
                status: 'Active'
            });
            await user.save();
            users.push(user);

            // Create Group
            const group = new Group({
                creator: user._id,
                name: `GroupName${i}`,
                description: `GroupDescription${i}`,
                tags: [`tag${i}a`, `tag${i}b`]
            });
            await group.save();
            groups.push(group);

            // Create Post with Group ID
            const postWithGroup = new Post({
                author: user._id,
                content: `This is content for Post${i} with Group.`,
                title: `PostTitle${i} with Group`,
                status: 'enabled'
            });
            postWithGroup.group = group._id;
            await postWithGroup.save();
            posts.push(postWithGroup);

            // Create Post without Group ID
            const postWithoutGroup = new Post({
                author: user._id,
                content: `This is content for Post${i} without Group.`,
                title: `PostTitle${i} without Group`,
                status: 'enabled'
            });
            await postWithoutGroup.save();
            posts.push(postWithoutGroup);
        }

        // Add all users to one group
        const oneGroup = groups[0];
        oneGroup.friends = users.map(u => u._id);
        await oneGroup.save();

        console.log('Mock data generated successfully!');
    } catch (error) {
        console.error('Error generating mock data:', error.message);
    }
};

exports.generateGroupAndChatMockData = async () => {
    try {
        // Step 1 and 2: Fetch users
        const allUsers = await User.find();
        if (allUsers.length < 2) {
            throw new Error("Not enough users to generate mock data.");
        }

        const user1 = allUsers[0];
        const otherUsers = allUsers.slice(1);

        // Step 3: Find the common group
        const commonGroup = await Group.findOne({ friends: { $all: allUsers.map(u => u._id) } });
        if (!commonGroup) {
            throw new Error("Couldn't find a group with all users.");
        }

        // Step 4: Create individual chats
        for (const user of otherUsers) {
            const chat = new Chat({
                type: 'user-chat',
                group_id: null, 
                messages: [{
                    sent_by: user1._id,
                    content: `Hello ${user.fname}! This is a mock message from ${user1.fname}.`
                },
                {
                    sent_by: user._id,
                    content: `Hello ${user1.fname}! This is a mock reply from ${user.fname}.`
                }]
            });

            await chat.save();
        }

        // Step 5: Create group chat and messages
        const groupChat = new Chat({
            type: 'group-chat',
            group_id: commonGroup._id,
            messages: allUsers.map(user => {
                return {
                    sent_by: user._id,
                    content: `Hello group! This is a mock message from ${user.fname}.`
                };
            })
        });

        await groupChat.save();
        console.log("Mock chat data generated successfully!");
    } catch (error) {
        console.error('Error generating mock chat data: ', error.message);
    }
};
