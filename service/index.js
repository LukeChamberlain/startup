const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');  // Added to handle JWT token generation
const DB = require('./database.js');  // Ensure your DB functions are correctly defined in this file

const app = express();
const authCookieName = 'token'; // Cookie name for the authentication token
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
  .then(() => console.log('Connected to MongoDB: musicApp'))
  .catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schemas and Models
const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  status: String, // 'Clean' or 'Explicit'
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  songs: [songSchema],
  token: String, // Authentication token for the user
});

const User = mongoose.model('User', userSchema);

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// User Registration (Create New User)
apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ msg: 'Existing user' });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email: email.trim().toLowerCase(), password: hashedPassword });
    await newUser.save();

    // Create a JWT token
    const token = jwt.sign({ id: newUser._id }, 'your_secret_key', { expiresIn: '1h' });

    // Set the token in a cookie
    setAuthCookie(res, token);

    res.status(201).json({ msg: 'User created', token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// User Login
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Compare the password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });

    // Set the token in a cookie
    setAuthCookie(res, token);

    res.status(200).json({ msg: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Logout: Clear the authentication cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);  // Clear the token cookie
  res.status(204).end();  // Successfully logout
});

// *** Secure API Routes *** 
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

// Middleware to check for authentication using JWT token in cookies
secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken); // Use token to fetch user
  if (user) {
    next();  // Proceed to next middleware or route handler
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Protected route to add a song to the user profile
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
    console.error('Error adding song:', error);  // Debug log
    res.status(500).send({ msg: 'Failed to add song' });
  }
});

// Get the songs for the authenticated user
secureApiRouter.get('/profile/songs', async (req, res) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);

  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  res.send(user.songs);
});

// *** Lyrics API ***
apiRouter.get('/lyrics', async (req, res) => {
  const { artist, title } = req.query;
  try {
    const lyrics = await getSongLyrics(artist, title);
    res.send({ lyrics });
  } catch (error) {
    console.error('Error fetching lyrics:', error); // Debug log
    res.status(500).send({ error: 'Failed to fetch lyrics' });
  }
});
// Backend API to search songs
apiRouter.get('/search', async (req, res) => {
  const { query, artist, song } = req.query;

  try {
    // Assuming you're querying a song database or an API for search results
    // Here, we're just filtering out some sample data as an example.
    const allSongs = [
      { title: 'Song A', artist: 'Artist 1', SongUrl: '/path/to/songA', ArtistUrl: '/path/to/artist1' },
      { title: 'Song B', artist: 'Artist 2', SongUrl: '/path/to/songB', ArtistUrl: '/path/to/artist2' },
      // Add more songs as needed
    ];

    // Simple filter by title or artist
    const filteredSongs = allSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(song.toLowerCase()) ||
        song.artist.toLowerCase().includes(artist.toLowerCase())
    );

    if (filteredSongs.length === 0) {
      return res.status(404).json({ msg: 'No songs found for the search' });
    }

    res.json(filteredSongs);
  } catch (err) {
    console.error('Error searching for songs:', err);
    res.status(500).json({ msg: 'An error occurred while searching for songs' });
  }
});


// *** Helper Functions *** 
async function getSongLyrics(artist, title) {
  const response = await axios.get(`http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=${artist}&song=${title}`);
  return response.data;
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: false, // Set to true for production (HTTPS)
    httpOnly: true,  // Make the cookie inaccessible to JavaScript
    sameSite: 'strict',  // Prevent CSRF attacks
  });
}

// *** Database Layer (DB.js) ***
async function getUserByToken(token) {
  return await User.findOne({ token });
}

module.exports = { getUserByToken };

// Start the server
const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
