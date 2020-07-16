
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
  const tweet = Object.keys(db.tweets).filter(tweet => db.tweets[tweet].id === tweetId)
  return db.tweets[tweet]
}
module.exports = { generateRandomString, getUserByEmail, getTweetById, getUserById }