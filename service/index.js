const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const xml2js = require('xml2js');
const path = require('path');
const cors = require('cors'); // CORS middleware

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;

const http = require('http');
const { peerProxy } = require('./peerProxy'); // Adjust the path as necessary

const httpServer = http.createServer(app); // Assuming `app` is your Express app
peerProxy(httpServer);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

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
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Router setup
const apiRouter = express.Router();
app.use('/api', apiRouter);

// *** User Management Routes ***

// User Registration
apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email: email.trim().toLowerCase(), password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// User Login
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    res.status(200).json({ msg: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// *** Lyrics and Search Routes ***

// Helper function to fetch song lyrics from ChartLyrics API
async function getSongLyrics(artist, title) {
  const response = await axios.get(
    `http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=${artist}&song=${title}`
  );
  return response.data;
}

// Route to get song lyrics by artist and title
apiRouter.get('/lyrics', async (req, res) => {
  const { artist, title } = req.query;

  try {
    const lyrics = await getSongLyrics(artist, title);
    res.send({ lyrics });
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    res.status(500).send({ error: 'Failed to fetch lyrics' });
  }
});

// Route to search for songs using ChartLyrics API
apiRouter.get('/search', async (req, res) => {
  const { query, artist, song } = req.query;

  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters long' });
  }

  const searchArtist = artist || query;
  const searchSong = song || query;

  try {
    const apiUrl = `http://api.chartlyrics.com/apiv1.asmx/SearchLyric?lyricText=${query}&artist=${searchArtist}&song=${searchSong}`;
    const response = await axios.get(apiUrl);
    const xmlData = response.data;

    const parser = new xml2js.Parser();
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return res.status(500).json({ error: 'Failed to parse search results' });
      }

      const searchResults = result.ArrayOfSearchLyricResult?.SearchLyricResult || [];
      if (searchResults.length === 0) {
        return res.status(404).json({ error: 'No songs found for the given lyrics' });
      }

      const songs = searchResults
        .filter((item) => item.Artist && item.Song)
        .map((item) => ({
          artist: item.Artist[0] || 'Unknown Artist',
          title: item.Song[0] || 'Unknown Title',
        }));

      res.json(songs);
    });
  } catch (error) {
    console.error('Error fetching search results:', error.message);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
