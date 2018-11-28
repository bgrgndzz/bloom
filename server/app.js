// require modules
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
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
const postsRoute = require('./routes/posts');
const postRoute = require('./routes/post');
const topicsRoute = require('./routes/topics');
const userRoute = require('./routes/user');
const searchRoute = require('./routes/search');
const webRoute = require('./routes/web');

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
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.json({limit: '10mb', extended: true}));

// logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// security
// const store = new expressBrute.MemoryStore();
// const bruteforce = new expressBrute(store);
// app.use(bruteforce.prevent);
app.use(cors());
app.use(helmet());

// routing
app.use('/auth', authRoute);
app.use('/posts', postsRoute);
app.use('/post', postRoute);
app.use('/topics', topicsRoute);
app.use('/user', userRoute);
app.use('/search', searchRoute);
app.use('/web', webRoute);

// listen to connections
server.listen(PORT);

module.exports = server;