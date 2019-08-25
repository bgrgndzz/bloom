// require modules
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectRedis = require('connect-redis');
const cors = require('cors');
const express = require('express');
const ExpressBrute = require('rate-limiter-flexible/lib/ExpressBruteFlexible')
const expressSession = require('express-session');
const helmet = require('helmet');
const http = require('http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const PushNotifications = require('node-pushnotifications');
const redis = require('redis');
const socketio = require('socket.io');
const socketRedis = require('socket.io-redis');

// dotenv config
dotenv.config({ path: path.join(__dirname, '.env') });

// require routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');
const postRoute = require('./routes/post');
const topicsRoute = require('./routes/topics');
const userRoute = require('./routes/user');
const usersRoute = require('./routes/users');
const searchRoute = require('./routes/search');
const notificationsRoute = require('./routes/notifications');
const messagesRoute = require('./routes/messages');
const schoolRoute = require('./routes/school');
const notificationTokenRoute = require('./routes/notificationToken');
const webRoute = require('./routes/web');
const adminRoute = require('./routes/admin');

// constants
const {
  MONGO_URI,
  PORT,
  SESSION_SECRET
} = process.env;

// mongoose connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true });

// server setup
const app = express();
const server = http.Server(app);
const io = socketio(server);

app.set('trust proxy', true);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb', extended: true }));

const redisClient = redis.createClient();
const RedisStore = connectRedis(expressSession);
const session = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    client: redisClient,
    ttl: 86400
  })
};
app.use(expressSession(session));
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.locals.users = [];

// push notification setup
const settings = {
  gcm: {
    id: null,
    phonegap: false,
  },
  apn: {
    token: {
      key: './key.p8',
      keyId: '5RX85Q29QD',
      teamId: '8DVKCD9DV6',
    },
    production: true
  },
  isAlwaysUseFCM: false,
};
const push = new PushNotifications(settings);
app.use((req, res, next) => {
  req.push = push;
  next();
});

// logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// security
const bruteRedisClient = redis.createClient({ enable_offline_queue: false });
const opts = {
  freeRetries: 10,
  minWait: 1000,
  maxWait: 10000,
  lifetime: 30,
  storeClient: bruteRedisClient,
};
const bruteforce = new ExpressBrute(
  ExpressBrute.LIMITER_TYPES.REDIS,
  opts
);
app.use(cors());
app.use(helmet());

// routing
app.use('/auth', bruteforce.prevent, authRoute);
app.use('/posts', postsRoute);
app.use('/post', postRoute);
app.use('/topics', topicsRoute);
app.use('/user', userRoute);
app.use('/users', usersRoute);
app.use('/search', searchRoute);
app.use('/notifications', notificationsRoute);
app.use('/messages', messagesRoute);
app.use('/school', schoolRoute);
app.use('/notificationToken', notificationTokenRoute);
app.use('/web', webRoute);
app.use('/admin', bruteforce.prevent, adminRoute);

// socket.io setup
io.adapter(socketRedis({
  host: 'localhost',
  port: 6379,
  client: redisClient,
  ttl: 86400
}));

io.on('connection', socket => {
  const { token } = socket.handshake.query;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, jwtRes) => {
      if (err) return false;

      let userIndex = app.locals.users.findIndex(user => user.id === jwtRes.user);

      if (userIndex === -1) {
        app.locals.users.push({
          id: jwtRes.user,
          socket
        });

        userIndex = app.locals.users.length;

        io.emit('online user', jwtRes.user);
      }

      socket.on('disconnect', () => {
        userIndex = app.locals.users.findIndex(user => user.id === jwtRes.user);
        app.locals.users.splice(userIndex, 1);

        io.emit('offline user', jwtRes.user);
      });
    });
  }
});

// listen to connections
server.listen(PORT);

module.exports = server;
