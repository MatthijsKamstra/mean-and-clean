import Express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';


const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || 8080;

// Initialize the Express App
const app = new Express();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// // Apply body Parser and server public assets and routes
// app.use(bodyParser.json({ limit: '20mb' }));
// app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
// app.use(Express.static(path.resolve(__dirname, '../dist/client')));
// app.use('/api', posts);

// API routes
// require('./routes')(app);

  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
  });

// Set up Mongoose
mongoose.connect(isDev ? config.db_dev : config.db);
// Set native promises as mongoose promise
mongoose.Promise = global.Promise;


app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
})

app.use(function (err, req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '500.html'));
})


// start app
app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.info('>>> 🌎 Open http://0.0.0.0:%s/ in your browser.', port);
});

module.exports = app;

// start app
// app.listen(port, (error) => {
//   if (!error) {
//     console.log(`MERN is running on port: ${port}! Build something amazing!`); // eslint-disable-line
//   }
// });

export default app;