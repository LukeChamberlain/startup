const express = require('express');
const axios = require('axios');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const DB = require('./database.js'); // Ensure DB functions are defined in this file

const app = express();
const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('trust proxy', true);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/musicApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  status: String, // 'Clean' or 'Explicit'
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  songs: [songSchema],
  token: String, // Auth token
});

const User = mongoose.model('User', userSchema);
const Song = mongoose.model('Song', songSchema);

module.exports = { User, Song };

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Auth Routes
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    return res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ id: user._id });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    setAuthCookie(res, user.token);
    res.send({ id: user._id });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Secure API Routes
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Add a song to user profile
secureApiRouter.post('/profile/add-song', async (req, res) => {
  const { title, artist, status } = req.body;
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);

  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  const newSong = { title, artist, status };
  user.songs.push(newSong);

  try {
    await user.save();
    res.send({ msg: 'Song added successfully' });
  } catch (error) {
    res.status(500).send({ msg: 'Failed to add song' });
  }
});

// Get list of songs for logged-in user
secureApiRouter.get('/profile/songs', async (req, res) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);

  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  res.send(user.songs);
});

// Get lyrics from ChartLyrics API
apiRouter.get('/lyrics', async (req, res) => {
  const { artist, title } = req.query;
  try {
    const lyrics = await getSongLyrics(artist, title);
    res.send({ lyrics });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch lyrics' });
  }
});

// Helper function to fetch song lyrics
async function getSongLyrics(artist, title) {
  const response = await axios.get(`http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=${artist}&song=${title}`);
  return response.data;
}

// Set the auth cookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
