const express       = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const {UserObj, EmptyUser} = require('../schema/User')
const { users } = require('../data-files/usersDB');
const {getUserByEmail, getUserById, getTweetById, searchEngineTweets, searchEngineUser} = require('../lib/util/helper')
const db = require('../lib/in-memory-db')

//GET THE HOMEPAGE
router.get('/twitter', (req, res) => {
  const user = users[req.session.user]
  if(user){
    res.render('index',{user:user})
  }else{
    const emptyUser = new EmptyUser
  res.render('index',{user:emptyUser})
  }
})

//GATE PAGE. WILL BE USED AGAINST UNLOGGED USERS
router.get('/gate', (req, res) => {
  res.render('gate_page')
})

//GET LOGIN FORM
router.get('/login', (req, res) => {
  res.render('login_page',{message:undefined})
})

//LOGIN ADD COOKIES
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

//LOGOUT REMOVE COOKIES
router.post('/logout', (req, res) => {
  req.session = null
  res.redirect('/login')
})

//GET REGISTRATION FORM
router.get('/registration', (req, res) => {
  const user = users[req.session.user]
  res.render('registration_page', {user: user, message:undefined})
})

//REGISTER = CREATE A NEW USER
router.post('/user', (req, res) => {
  const { email, password, userName } = req.body;
  const existingUser = getUserByEmail(email, users)
  if(existingUser){
    res.render('registration_page', {message:'Sorry this user already exists.'})
  }else{
  const user = new UserObj(email, password, userName);
  users[user.id] = user
  user.addAvatars()
  req.session.user = user.id
  res.redirect('/twitter')
  }
})

// //FOLLOW NEW USER
// router.post('/following/:id', (req, res) => {
//   const user = getUserById(req.session.user, users)
//   const target = getUserById(req.params, users)
//   user.follows(target)
//   console.log(user)
//   res.status(201).send();
// })

router.get('/search', (req, res) => {
  const tweets = searchEngineTweets(req.query.q, db)
  res.json(tweets)
})

// //GET USER PROFILE
router.get('/user/:id', (req, res)=> {
  const user = getUserById(req.params.id, users)
  console.log('showing user profile')
  res.render('user_profile', {user: user} )
})

//FOLLOW NEW USER
router.post('/following/:id', (req, res) => {
  const user = getUserById(req.session.user, users)
  const target = getUserById(req.params.id, users)

  user.startFollows(target.id)
  console.log(`${user.name} is Following ${target.name}`)
  res.status(201).send();
})


module.exports = router