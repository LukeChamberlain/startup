const express = require('express');
const uuid = require('uuid');
const axios = require('axios');
const xml2js = require('xml2js');
const path = require('path');
const cors = require('cors'); // Add CORS middleware

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// In-memory users object for storing user data
let users = {};

// XML parser setup for handling XML responses from ChartLyrics API
const parser = new xml2js.Parser();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());  // Use CORS middleware to allow cross-origin requests

// Define an API router for all /api routes
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Route to create a new user
apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;
  const user = users[email];

  if (user) {
    return res.status(409).send({ msg: 'Existing user' });
  } else {
    const newUser = { email, password, token: uuid.v4() };
    users[email] = newUser;
    return res.send({ token: newUser.token });
  }
});

// Route to log in an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users[email];

  if (user && password === user.password) {
    user.token = uuid.v4();
    return res.send({ token: user.token });
  }
  return res.status(401).send({ msg: 'Unauthorized' });
});

// Route to log out a user
apiRouter.delete('/auth/logout', (req, res) => {
  const { token } = req.body;
  const user = Object.values(users).find((u) => u.token === token);
  if (user) {
    delete user.token;
  }
  res.status(204).end();
});

// Helper function to fetch song lyrics from ChartLyrics API
async function getSongLyrics(artist, title) {
  const response = await axios.get(`http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=${artist}&song=${title}`);
  return response.data;
}

// Route to get song lyrics by artist and title
apiRouter.get('/lyrics', async (req, res) => {
  const { artist, title } = req.query;

  try {
    const lyrics = await getSongLyrics(artist, title);
    res.send({ lyrics });
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    res.status(500).send({ error: 'Failed to fetch lyrics' });
  }
});

apiRouter.get('/search', async (req, res) => {
  const { query, artist, song } = req.query;
  console.log("Incoming search request - query:", query, "artist:", artist, "song:", song);

  if (!query || query.length < 2) {
    return res.status(400).send({ error: 'Search query must be at least 2 characters long' });
  }

  const searchArtist = artist || query;
  const searchSong = song || query;

  try {
    const apiUrl = `http://api.chartlyrics.com/apiv1.asmx/SearchLyric?lyricText=${query}&artist=${searchArtist}&song=${searchSong}`;
    console.log("Making request to ChartLyrics API:", apiUrl);  // Log full API URL

    const response = await axios.get(apiUrl);
    console.log("API response data:", response.data);  // Log the raw API response

    const xmlData = response.data;
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return res.status(500).send({ error: 'Failed to parse search results' });
      }

      // Check if the result is valid and contains songs
      const searchResults = result.ArrayOfSearchLyricResult?.SearchLyricResult || [];

      if (searchResults.length === 0 || searchResults[0]?.Artist === undefined) {
        console.log('No valid results found for query:', query);
        return res.status(404).json({ error: 'No songs found for the given lyrics' });
      }

      // Filter out invalid results like 'Unknown Artist' or 'Unknown Title'
      const songs = searchResults
        .filter(item => item.Artist && item.Song && item.Artist[0] !== 'Unknown Artist' && item.Song[0] !== 'Unknown Title')
        .map(item => ({
          artist: item.Artist ? item.Artist[0] : 'Unknown Artist', 
          title: item.Song ? item.Song[0] : 'Unknown Title',  
        }));

      console.log("Returning songs:", songs);
      return res.json(songs);
    });
  } catch (error) {
    console.error('Error fetching songs from ChartLyrics API:', error);
    return res.status(500).send({ error: 'Failed to fetch songs' });
  }
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, 'public'))); 

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
