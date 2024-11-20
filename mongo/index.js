const express = require('express');
const uuid = require('uuid');
const axios = require('axios');
const xml2js = require('xml2js');
const path = require('path');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// MongoDB connection setup
const config = require('./dbConfig.json'); // Replace with your actual config file
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

// Connect to MongoDB
let db;
let usersCollection;

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

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;
const parser = new xml2js.Parser();

app.use(express.json());
app.use(cors());

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

// Route to create a new user
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

// Route to log in an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    const token = uuid.v4();

    // Optionally update user document in MongoDB to store the session token
    await usersCollection.updateOne({ email }, { $set: { token } });

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

// Route to log out a user
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

// MongoDB collections for user selections
let userSelectionsCollection;

async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db('rental'); // Replace with your actual database name
    usersCollection = db.collection('users');
    userSelectionsCollection = db.collection('userSelections'); // New collection
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

// Route to save user-selected song and filters
apiRouter.post('/saveSelection', async (req, res) => {
  const { email, song, filters, lyrics } = req.body;

  if (!email || !song || !filters) {
    return res.status(400).send({ error: 'Email, song, and filters are required' });
  }

  try {
    const result = await userSelectionsCollection.insertOne({
      email,
      song,
      filters,
      lyrics,
      timestamp: new Date(),
    });

    res.status(201).send({ message: 'Selection saved successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error saving selection:', error);
    res.status(500).send({ error: 'Failed to save selection' });
  }
});

// Route to fetch saved selections for a user
apiRouter.get('/getSelections', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send({ error: 'Email is required' });
  }

  try {
    const selections = await userSelectionsCollection.find({ email }).toArray();
    res.status(200).send(selections);
  } catch (error) {
    console.error('Error fetching selections:', error);
    res.status(500).send({ error: 'Failed to fetch selections' });
  }
});

