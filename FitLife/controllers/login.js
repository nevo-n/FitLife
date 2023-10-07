const User = require("../models/user")
const Group = require("../models/group")
const Post = require("../models/post")

const LoginService = require("../services/login")
const UserService = require("../services/user")





function isLoggedIn(req, res, next) {
  if (req.session.email != null)
    return next()
  else
    res.redirect('/login/login')
}

function loginForm(req, res) { 
  if (req.session.email != null){
    return res.redirect('/me/feed')
  }
  else {
    res.render("login/login", {}) 
  }
}

function registerForm(req, res) { 
  res.render("login/register", {}) 
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/login/login');
  });
}

async function login(req, res) {
  const { email, password } = req.body
  const is_exists = await LoginService.loginUser(email, password)
  if (is_exists ) {
    req.session.email = email
    res.redirect('/me/feed')
  }
  else
    res.redirect('/login/login?error=1')
}

async function register(req, res) {
  const { email, password, fname, lname, date_of_birth, type } = req.body
  
  const user = await UserService.fetchUser(email)
  if (user != null){
    return res.redirect('/login/login?error=2')
  }

  await LoginService.registerUser(fname, lname, email, password, date_of_birth, type, 'active')
  
  req.session.email = email
  return res.redirect('/me/feed')
 
}

async function mock1(req, res) {
  // Step 1: Create Users
  
  const mockUsers = [];
  for (let i = 0; i < 10; i++) {
      const user = new User({
          fname: `User${i}`,
          lname: `LastName${i}`,
          email: `user${i}@example.com`,
          password: 'password123',
          date_of_birth: new Date(),
          type: 'trainee',
          status: 'Active'
      });
      await user.save();
      mockUsers.push(user);
  }

  // Step 2: Create Groups
  const groupOwners = mockUsers.slice(0, 5);
  for (const owner of groupOwners) {
      const group = new Group({
          creator: owner._id,
          name: `GroupOf${owner.fname}`,
          description: `This is a group owned by ${owner.fname}`,
          tags: ['tag1', 'tag2', 'tag3'],
          freinds: [owner._id]
      });
      
      // Step 3: Add Friends to Groups
      const randomFriends = mockUsers.filter(u => u._id.toString() !== owner._id.toString());
      group.friends = randomFriends.slice(0, Math.floor(Math.random() * 3) + 2).map(u => u._id);
      
      await group.save();
      owner.groups.push(group._id);
      await owner.save();
      
      // Step 4: Create Posts for Groups
      for (let i = 0; i < 7; i++) {
        const randomFriendId = group.friends[Math.floor(Math.random() * group.friends.length)];

        // Find postAuthor
        const postAuthor = mockUsers.find(u => u._id.equals(randomFriendId));

        // Check if postAuthor is found
        if (!postAuthor) {
            console.error(`No user found for ID ${randomFriendId}. Skipping post creation.`);
            continue;
        }

        // If postAuthor is found, create a new post
        const post = new Post({
            author: postAuthor._id,
            content: `This is a post ${i} in ${group.name}`,
            title: `Post ${i} Title`
        });
        await post.save();
        
        // Add this post to the postAuthor's posts field
        postAuthor.posts.push(post._id);
        await postAuthor.save();

        group.posts.push(post._id);
        await group.save();

      }
  }

  // Step 5: Update User Following
  for (const user of mockUsers) {
      const randomUsers = mockUsers.filter(u => u._id.toString() !== user._id.toString());
      user.following = randomUsers.slice(0, 5).map(u => u._id);
      await user.save();
  }

  res.send("done")
}



module.exports = {
  login,
  loginForm,
  register,
  registerForm,
  logout,
  isLoggedIn,
  mock1
}