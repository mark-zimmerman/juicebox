const express = require('express');

const postsRouter = express.Router();
const {getAllPosts, createPost} = require('../db');
const { requireUser } = require('./utils');


postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  const postData = {};
  
  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }
  
  try {
    // add authorId, title, content to postData object
    postData.authorId = req.user.id;
    postData.title = title;
    postData.content = content;
    postData.tags = tagArr;
    
    console.log('this is the post data', postData);
    console.log('this is the req.user.id', req.user.id);
    const post = await createPost(postData);
    console.log(post);
    if (post) {
      res.send({ post });
    } else {
      next({
        name: 'Error creating post',
        message: `Error creating post`
      });
    }
    // this will create the post and the tags for us
    // if the post comes back, res.send({ post });
    // otherwise, next an appropriate error object 
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
        posts
    })
});




module.exports = postsRouter;