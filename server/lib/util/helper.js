
const generateRandomString = function(num) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomStr = '';
  for (let i = num; i > 0; i--) {
    randomStr += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return randomStr;
};

const getUserByEmail = function(email, database) {
  const user = Object.keys(database).filter(user => database[user].email === email);
  return database[user];
};

const getUserById = function(id, database) {
  const user = Object.keys(database).filter(user => database[user].id === id);
  return database[user];
};

const getTweetById = function(tweetId, db){
  const tweet = db.tweets.filter(tweet => tweet.content.id === tweetId)
  return tweet[0]
}

const searchEngineUser = function(){
  const searchUsersArray = db.tweets
  .map(tweet => {
    return JSON.stringify({name:tweet.user.name, username: tweet.user.handle, id:tweet.user.id})
  })
  .filter(elm => elm.includes(query))
  .map(elm => {
    return JSON.parse(elm).id
  })
  const finalData = []
  searchUsersArray.forEach(elm=>{
    finalData.push(getUserById(elm, db))
  })
  return finalData
}

const searchEngineTweets = function(query, db){
  const searchTweetsArray = db.tweets
  .map(tweet => {
    return JSON.stringify({text:tweet.content.text, id: tweet.content.id})
  })
  .filter(elm => elm.includes(query))
  .map(elm => {
    return JSON.parse(elm).id
  })
  const finalData = []
  searchTweetsArray.forEach(elm=>{
    finalData.push(getTweetById(elm, db))
  })
  return finalData
}
module.exports = { 
  generateRandomString, 
  getUserByEmail, 
  getTweetById, 
  getUserById,
  searchEngineTweets,
  searchEngineUser
}