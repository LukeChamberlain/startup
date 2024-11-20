const express = require('express');
const uuid = require('uuid');
const axios = require('axios');
const xml2js = require('xml2js');
const path = require('path');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // Import JWT for token generation

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// MongoDB connection setup
const config = require('./dbConfig.json'); // Replace with your actual config file
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

let db;
let usersCollection;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db('rental'); // Replace with your actual database name
    usersCollection = db.collection('users');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

connectToMongoDB();

// Middleware to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

// XML parser setup for handling XML responses from ChartLyrics API
const parser = new xml2js.Parser();

// Define an API router for all /api routes
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Helper functions for MongoDB
async function createUser(email, password) {
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await usersCollection.insertOne({ email, password: hashedPassword });
  return result.insertedId;
}

async function authenticateUser(email, password) {
  const user = await usersCollection.findOne({ email });
  if (!user) throw new Error('User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  return user;
}

// JWT Token generation helper
function generateToken(user) {
  const payload = { userId: user._id, email: user.email };
  const secretKey = 'your-secret-key'; // This should be in an environment variable
  const options = { expiresIn: '1h' }; // Expiration time for the token

  return jwt.sign(payload, secretKey, options);
}

// Routes for authentication
apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userId = await createUser(email, password);
    res.status(201).send({ message: 'User created successfully', userId });
  } catch (error) {
    if (error.message === 'User already exists') {
      res.status(409).send({ error: 'User already exists' });
    } else {
      console.error('Error creating user:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    const token = generateToken(user);  // Generate JWT token on successful login
    await usersCollection.updateOne({ email }, { $set: { token } }); // Update token in the user document

    res.status(200).send({ message: 'Login successful', token });
  } catch (error) {
    if (error.message === 'Invalid credentials' || error.message === 'User not found') {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      console.error('Error logging in user:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  }
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const { token } = req.body;

  try {
    const result = await usersCollection.updateOne({ token }, { $unset: { token: '' } });

    if (result.modifiedCount === 0) {
      return res.status(400).send({ error: 'Invalid token' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
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

// Route to search for songs by lyrics
apiRouter.get('/search', async (req, res) => {
  const { query, artist, song } = req.query;

  if (!query || query.length < 2) {
    return res.status(400).send({ error: 'Search query must be at least 2 characters long' });
  }

  try {
    const apiUrl = `http://api.chartlyrics.com/apiv1.asmx/SearchLyric?lyricText=${query}&artist=${artist || query}&song=${song || query}`;
    const response = await axios.get(apiUrl);

    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return res.status(500).send({ error: 'Failed to parse search results' });
      }

      const searchResults = result.ArrayOfSearchLyricResult?.SearchLyricResult || [];
      const songs = searchResults
        .filter(item => item.Artist && item.Song && item.Artist[0] !== 'Unknown Artist' && item.Song[0] !== 'Unknown Title')
        .map(item => ({
          artist: item.Artist[0],
          title: item.Song[0],
        }));

      if (songs.length === 0) {
        return res.status(404).json({ error: 'No songs found for the given lyrics' });
      }

      res.json(songs);
    });
  } catch (error) {
    console.error('Error fetching songs from ChartLyrics API:', error);
    res.status(500).send({ error: 'Failed to fetch songs' });
  }
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
