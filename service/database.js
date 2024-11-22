const mongoose = require('mongoose');
const config = require('./dbConfig.json');

// MongoDB Connection String from config
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));
  
const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  status: String, // 'Clean' or 'Explicit'
});

// Define a schema for users
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  songs: [songSchema],  // Array of songs
  token: String,  // Authentication token
});

// Check if the 'User' model already exists in mongoose.models
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Create a function to get a user by email
const getUser = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;  // Returns the user document
  } catch (err) {
    console.log('Error fetching user:', err);
    throw err;
  }
};

// Create a function to create a new user
const createUser = async (email, password) => {
  try {
    const newUser = new User({
      email,
      password,  // Ensure you hash the password before saving it in production
    });
    await newUser.save();  // Save the new user to the database
    return newUser;
  } catch (err) {
    console.log('Error creating user:', err);
    throw err;
  }
};

// Create a function to get a user by their authentication token
const getUserByToken = async (token) => {
  try {
    const user = await User.findOne({ token });
    return user;  // Returns the user document
  } catch (err) {
    console.log('Error fetching user by token:', err);
    throw err;
  }
};

// Export functions to be used in other files
module.exports = { getUser, createUser, getUserByToken };
