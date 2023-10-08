var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

console.log('Starting FitLife')
mongoose.connect('mongodb://127.0.0.1:27017/FitLife', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Could not connect to MongoDB', error));

var app = express()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public'))); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'somekey', // should be get from env
    resave: false,
    saveUninitialized: true
  }));

const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const chatRoutes = require('./routes/chat');
const loginRoutes = require('./routes/login')
const searchRoutes = require('./routes/search')


const loginController = require("./controllers/login")


app.use('/me', loginController.isLoggedIn , userRoutes);
app.use('/group',loginController.isLoggedIn,  groupRoutes);
app.use('/chat',loginController.isLoggedIn, chatRoutes);
app.use('/search', loginController.isLoggedIn, searchRoutes)
app.use('/login', loginRoutes);

app.listen(8800)