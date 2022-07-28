const express = require('express');
const apiRouter = express.Router();

const tagsRouter = require('./tags');
const usersRouter = require('./users');
const postsRouter = require('./posts')

const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;


apiRouter.use(async (req, res, next) => {
  console.log('hey there');
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      console.log('inside the set req.user middleware');
      if (id) {
        
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});
apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  } else {
    console.log('we dont have a user');
  }
  next();
});

apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);
module.exports = apiRouter;







// set `req.user` if possible

// all routers attached ABOVE here
apiRouter.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message
    });
  });