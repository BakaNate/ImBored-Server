const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');

// Tools
const { Xlog } = require('../tools/Xlog');
const Constants = require('../tools/Constants');

const constant = new Constants();

const port = (process.env.NODE_ENV === 'production') ? constant.PORT : constant.PORT_DEV;
const mongooseUri = (process.env.NODE_ENV === 'production') ? process.env.MONGOLAB_URI || process.env.MONGODB_URI || constant.DB_URI : constant.DB_URI_DEV;

const User = require('../models/UserModel');


console.time('[*] Booting');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  Xlog('User connected', '[INF]');
  socket.on('join', async ({ user, room }, cb) => {
    Xlog(`User: ${user} connected to room: ${room}`, '[INF]');
    await User.addRoom(user, room, (err, cbUser) => {
      if (err) {
        Xlog(`ERROR IN ADDROOM:\n${err}`, '[ERR]');
        return cb(err);
      }
      return (cbUser);
    });

    socket.emit('message', { user: 'admin', text: `Welcome ${user} to our room: ${room}` });
    socket.broadcast.to(room).emit('message', { user: 'admin', text: `${user}, has joined!` });

    socket.join(room);
    cb();
  });

  socket.on('sendMessage', (message, userEmail, room, cb) => {
    io.to(room).emit('message', { user: userEmail, text: `${userEmail}: ${message}` });
    cb();
  });

  socket.on('disconnect', () => {
    Xlog('User Disconnected', '[INF]');
  });
});

function configApp(theapp) {
  theapp.use(cors((req, next) => {
    const options = {
      origin: '*',
      optionsSuccessStatus: 200,
    };
    next(null, options);
  }));

  app.use(helmet());
  app.use((req, res, next) => { // Overrides some of Helmet's properties
    res.header('Content-Security-Policy', 'default-src \'self\''); // Added layer to prevent from injections (See: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP to write the appropriate policy)
    res.header('X-Frame-Options', 'SAMEORIGIN'); // ClickJacking/ClickBaiting Protection
    res.header('X-XSS-Protection', '1; mode=block'); // XSS Protection (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)
    res.header('X-Content-Type-Options', 'nosniff'); // No-Sniffing Content-Type
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH'); // General Allowed Methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, x-access-token, Accept'); // Access Control Exhaustive List
    res.header('x-powered-by', 'BakaNate'); // Anti stack disclose
    next();
  });

  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(passport.initialize());

  app.use(router);
}

function initMongoConnect() {
  mongoose.Promise = global.Promise;
  mongoose.connect(mongooseUri, {
    useCreateIndex: true,
    useNewUrlParser: true,
  }).then(() => {
    Xlog('Successfully connected to the mongoDB server', 'INF');
  }).catch((err) => {
    Xlog(err, 'ERR');
  });
}

initMongoConnect();
configApp(app);

server.listen(port, () => {
  Xlog('ImBored server', 'INF');
  Xlog('Written by BakaNate', 'INF');
  Xlog('For Epitech', 'INF');
  Xlog('Before running the app, consider \'npm audit\' && \'snyk test\' to check for any vulnerabilities', 'INF');
  Xlog('Moreover, have a look at : https://www.npmjs.com/advisories\n\n', 'INF');
  Xlog(`REST API listening at: ${server.address().address}:${server.address().port}`, 'INF');
  Xlog(`Mongoose URI: ${mongooseUri}`, 'INF');

  console.timeEnd('[*] Booting');

  process.on('SIGINT', () => {
    Xlog('\n\n So long, and thanks for all the fish !\n\r');
    process.exit(0);
  });
});
