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

  else if(typeof req.query.error !== 'undefined' && req.query.error == 'notExists'){
    return res.render("login/login", {
      data: {
        message: 'notExists'
      }
    }) 
  }
  
  else {
    return res.render("login/login", {
      data: {
        message: ''
      }
    }) 
  }
  
  
}

async function login(req, res) {
  const { email, password } = req.body
  const is_exists = await LoginService.loginUser(email, password)
  if (is_exists ) {
    req.session.email = email
    res.redirect('/me/feed')
  }
  else
    res.redirect('/login/login?error=notExists')
}


function registerForm(req, res) { 
  if(typeof req.query.error !== 'undefined' && req.query.error == 'emailExists'){
    return res.render("login/register", {
      data: {
        message: 'emailExists'
      }
    }) 
  }
  
  else {
    return res.render("login/register", {
      data: {
        message: ''
      }
    }) 
  }

}


async function register(req, res) {
  const { email, password, fname, lname, date_of_birth, type } = req.body
  
  const user = await UserService.fetchUser(email)
  if (user != null){
    return res.redirect('/login/register?error=emailExists')
  }

  await LoginService.registerUser(fname, lname, email, password, date_of_birth, type, 'Active')
  
  req.session.email = email
  return res.redirect('/me/feed')
 
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/login/login');
  });
}




module.exports = {
  login,
  loginForm,
  register,
  registerForm,
  logout,
  isLoggedIn,

}