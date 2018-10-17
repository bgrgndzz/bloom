// require modules
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const expressBrute = require('express-brute');
const helmet = require('helmet');
const http = require('http');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

// dotenv config
dotenv.config({path: path.join(__dirname, '.env')});

// require routes
const authRoute = require('./routes/auth');

// constants
const {
  MONGO_URI,
  PORT
} = process.env;

// mongoose connection
mongoose.connect(MONGO_URI, {useNewUrlParser: true});

// server setup
const app = express();
const server = http.Server(app);

app.set('trust proxy', true);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// security
// const store = new expressBrute.MemoryStore();
// const bruteforce = new expressBrute(store);
// app.use(bruteforce.prevent);
app.use(helmet());

// routing
app.use('/auth', authRoute);

// listen to connections
server.listen(PORT);

module.exports = server;