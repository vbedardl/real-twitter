const bcrypt = require('bcrypt');
const {generateRandomString} = require('../lib/util/helper')

const avatars = ["https://i.imgur.com/nlhLi3I.png","https://i.imgur.com/z5LNkkB.png","https://i.imgur.com/v0JXau2.png","https://i.imgur.com/lRUnDgU.png", "https://i.imgur.com/3GvwNBf.png","https://i.imgur.com/73hZDYK.png","https://i.imgur.com/5fUVPRP.png","https://i.imgur.com/DVpDmdR.png","https://i.imgur.com/2WZtOD6.png", "https://i.imgur.com/ilT4JDe.png"]

class UserObj {
  constructor(email, password, name) {
    this.id = generateRandomString(4),
    this.email = email,
    this.password = bcrypt.hashSync(password, 10),
    this.name = name,
    this.avatars = "https://via.placeholder.com/100",
    this.handle = `@${name.split(' ')[1].substring(0,3)}${name.split(' ')[0][0]}`,
    this.tweets = [],
    this.likedTweets = [],
    this.follows = []
    this.createAt = Date.now(),
    this.location = undefined
  }
  addTweet(tweet){
    this.tweets.push(tweet)
  }
  addAvatars(){
    this.avatars = `https://via.placeholder.com/150?text=${this.name[0]}`
  }
  startFollows(target){
    this.follows.push(target)
  }
}

class EmptyUser {
  constructor(){
  this.id = undefined,
  this.email = undefined,
  this.password = undefined,
  this.name = undefined,
  this.avatars = undefined,
  this.handle = undefined
  }
} 
module.exports = {UserObj, EmptyUser };