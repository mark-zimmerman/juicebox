require('dotenv').config();
const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();
const {client} = require('./db');
const morgan = require('morgan');

client.connect();

server.use(morgan('dev'));
server.use(express.json())

//Morgan logs info in your console like status messages


const apiRouter = require('./api');




server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
    
    next();
  });

  server.use('/api', apiRouter);

  server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});