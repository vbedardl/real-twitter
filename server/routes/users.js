const express       = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const UserObj = require('../schema/User')
const { users } = require('../data-files/usersDB');
const {getUserByEmail} = require('../lib/util/helper')

const emptyUser = {
  id: undefined,
  email: undefined,
  password: undefined,
  name:undefined,
  avatars:undefined,
  handle:undefined
}

router.get('/twitter', (req, res) => {
  const user = users[req.session.user]
  if(user){
    res.render('index',{user:user})
  }else{
  res.render('index',{user:emptyUser})
  }
})

router.get('/registration', (req, res) => {
  const user = users[req.session.user]
  res.render('registration_form', {user: user, message:undefined})
})

router.get('/login', (req, res) => {
  res.render('login_page',{message:undefined})
})

router.get('/gate', (req, res) => {
  res.render('gate_page')
})

router.post('/login', (req, res) => {
  const { password, email } = req.body;
  const user = getUserByEmail(email, users);
  if (!user) {
    res.render('login_page',{message:'We couldnt find any user matching those criteria'});
    return;
  }
  if (!bcrypt.compareSync(password, user.password)) {
    res.render('login_page',{message:'We couldnt find any user matching those criteria'});
    return;
  }
  req.session.user = user.id
  res.redirect('/twitter');
})

router.post('/logout', (req, res) => {
  req.session = null
  res.redirect('/login')
})

router.post('/user', (req, res) => {
  const { email, password, userName } = req.body;
  const existingUser = getUserByEmail(email, users)
  if(existingUser){
    res.render('registration_form', {message:'Sorry this user already exists.'})
  }else{
  const user = new UserObj(email, password, userName);
  users[user.id] = user
  user.addAvatars()
  req.session.user = user.id
  res.redirect('/twitter')
  }
})


module.exports = router