"use strict";

const userHelper = require("../lib/util/user-helper");
const express = require("express");
const router = express.Router();
const { users } = require("../data-files/usersDB");
const { tweets } = require("../data-files/tweetsDB");
const db = require("../lib/in-memory-db");
const TwitterObj = require("../schema/Tweet");
const { getTweetById } = require("../lib/util/helper");
const bodyParser = require("body-parser");
const { getTweetById, getUserById } = require("../lib/util/helper");

router.use(bodyParser.urlencoded({ extended: true }));

//GET A SPECIFIC TWEET BY ID
router.get("/:id", (req, res) => {
  const user = users[req.session.user]
    ? users[req.session.user]
    : userHelper.generateRandomUser();
  const tweet = getTweetById(req.params.id, db);
  console.log("template vars tweet: ", tweet);
  res.render("tweet_page", { user: user, tweet: tweet });
});

//GET LIST OF TWEETS
router.get("/", (req, res) => {
  const sortNewestFirst = (a, b) => a.created_at - b.created_at;
  const sortedTweets = db.tweets.sort(sortNewestFirst);
  res.json(sortedTweets);
});

//POST A NEW TWEET
router.post("/", (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ error: "invalid request: no data in POST body" });
    return;
  }

  const user = users[req.session.user]
    ? users[req.session.user]
    : userHelper.generateRandomUser();
  const theTweet = new TwitterObj(req.body.text, user);
  const tweet = {
    user: user,
    content: theTweet,
    created_at: Date.now(),
  };
  // user.addTweet(theTweet)
  db.tweets.push(tweet);
  res.status(201).send();
});

//LIKE A TWEET
router.post("/like/:id", (req, res) => {
  const user = getUserById(req.session.user, users);
  const tweet = getTweetById(req.params.id, db);
  tweet.content.likesIt(user);
  console.log(tweet);
  res.status(201).send;
});

module.exports = router;
