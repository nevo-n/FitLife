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




module.exports = {
  login,
  loginForm,
  register,
  registerForm,
  logout,
  isLoggedIn,

}