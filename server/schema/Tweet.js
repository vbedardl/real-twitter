const {generateRandomString} = require('../lib/util/helper')

class TwitterObj {
  constructor(text, owner) {
    this.owner = owner,
    this.id = generateRandomString(4),
    this.text = text,
    this.createdAt = Date.now(),
    this.comments = [],
    this.retweets = 0,
    this.likes = []
  }
  likesIt(user){
    this.likes.push(user)
  }
  commentsIt(user, comment){
    this.comments.push({user:user, comment:comment})
  }
}
module.exports = TwitterObj;