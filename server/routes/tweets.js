"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();
const { users } = require('../data-files/usersDB')
const db = require('../lib/in-memory-db')
const TwitterObj = require('../schema/Tweet')

tweetsRoutes.get('/', (req, res) => {

  const sortNewestFirst = (a, b) => a.created_at - b.created_at;
  const sortedTweets = db.tweets.sort(sortNewestFirst);
  res.json(sortedTweets)
})

tweetsRoutes.post('/', (req, res) => {
  if(!req.body.text){
    res.status(400).json({ error: 'invalid request: no data in POST body'})
    return
  }

    const user = users[req.session.user] ? users[req.session.user] : userHelper.generateRandomUser();
    const twit = new TwitterObj(req.body.text, user)
    const tweet = {
      user: user,
      content: twit,
      created_at: Date.now()
    };
    db.tweets.push(tweet)
    res.status(201).send();

})

module.exports = tweetsRoutes

// module.exports = function(DataHelpers) {

//   tweetsRoutes.get("/", function(req, res) {
//     DataHelpers.getTweets((err, tweets) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json(tweets);
//       }
//     });
//   }); 

//   tweetsRoutes.post("/", function(req, res) {
//     if (!req.body.text) {
//       res.status(400).json({ error: 'invalid request: no data in POST body'});
//       return;
//     }

//     const user = users[req.session.user] ? users[req.session.user] : userHelper.generateRandomUser();
//     const tweet = {
//       user: user,
//       content: {
//         text: req.body.text
//       },
//       created_at: new Date().toDateString()
//     };

//     DataHelpers.saveTweet(tweet, (err) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//       } else {
//         res.status(201).send();
//       }
//     });
//   });

//   return tweetsRoutes;

// }