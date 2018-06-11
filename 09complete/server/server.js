const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');

// use .env or the config!
const config = require('../config/config');
console.log(`config: `);
console.log(config);

// connect to the MongoDB
let mongoConnect = config.mongoURL;
if (config.mongoURL !== '' && config.mongoUser !== '' && config.mongoPass != '') {
  mongoConnect = `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoURL}/${config.mongoDBName}`;
} else if (config.mongoURL !== '') {
  mongoConnect = `${config.mongoURL}/${config.mongoDBName}`;
}
// console.log(mongoConnect);

// Use Node's default promise instead of Mongoose's promise library
mongoose.Promise = global.Promise;

mongoose.connect(mongoConnect)
  .catch((err) => {
    if (err) console.error(err);
});

var db = mongoose.connection;
db.on('open', () => {
  console.log(`Connected to the database "${mongoConnect}".`);
});

db.on('error', (err) => {
  console.log(`Database error: ${err}`);
});

// Instantiate express
const app = express();

// Don't touch this if you don't know it
// We are using this for the express-rate-limit middleware
// See: https://github.com/nfriedly/express-rate-limit
// app.enable('trust proxy');

// Set public folder using built-in express.static middleware
app.use(express.static( path.resolve(__dirname , '../public/')));

// Set body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable cross-origin access through the CORS middleware
// NOTICE: For React development server only!
// if (process.env.CORS) {
//   app.use(cors());
// }


// Initialize routes middleware
app.use('/api/users', require('./routes/users'));
app.use('/api/foo', require('./routes/foo'));

// require('./routes')(app);

// show homepage
app.get('/', function (req,res) {
	res.sendFile( path.resolve(__dirname , '../public/index.html'));
});

// Use express's default error handling middleware
// app.use((err, req, res, next) => {
//   if (res.headersSent) return next(err);
//   res.status(400).json({ err: err });
// });


app.use(function (req, res, next) {
	res.sendFile( path.resolve(__dirname , '../public/404.html'));
});

app.use(function (err, req, res, next) {
	res.sendFile( path.resolve(__dirname , '../public/500.html'));
});


// Start the server
const server = app.listen(config.port, () => {
  // console.log(`Listening on port ${config.port}`);
  // console.info('>>> 🌎 Open http://0.0.0.0:%s/ in your browser.', config.port);
  console.info('>>> 🌎 Open http://localhost:%s/ in your browser.', config.port);
});

// Set up socket.io
const io = socket(server);
let online = 0;

io.on('connection', (socket) => {
  online++;
  console.log(`Socket ${socket.id} connected.`);
  console.log(`Online: ${online}`);
  io.emit('visitor enters', online);

  socket.on('add', data => socket.broadcast.emit('add', data));
  socket.on('update', data => socket.broadcast.emit('update', data));
  socket.on('delete', data => socket.broadcast.emit('delete', data));
  socket.on('message', data => console.log( data ));

  socket.on('disconnect', () => {
    online--;
    console.log(`Socket ${socket.id} disconnected.`);
    console.log(`Online: ${online}`);
    io.emit('visitor exits', online);
  });
});
