// index.js
const express = require('express');
const uuid = require('uuid');
const app = express();

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = {};
let scores = [];

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Create a new user
apiRouter.post('/auth/create', async (req, res) => {
  console.log('Create user request received:', req.body);
  
  const { email, password } = req.body;
  const user = users[email];

  if (user) {
    console.log('User already exists:', email);
    return res.status(409).send({ msg: 'Existing user' });
  } else {
    const newUser = { email, password, token: uuid.v4() };
    users[email] = newUser;
    console.log('New user created:', newUser);
    return res.send({ token: newUser.token });
  }
});

// Login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  console.log('Login request received:', req.body);

  const { email, password } = req.body;
  const user = users[email];

  if (user && password === user.password) {
    user.token = uuid.v4();
    console.log('Login successful for user:', email);
    return res.send({ token: user.token });
  }
  console.log('Unauthorized login attempt:', email);
  return res.status(401).send({ msg: 'Unauthorized' });
});

// Logout a user
apiRouter.delete('/auth/logout', (req, res) => {
  const { token } = req.body;
  const user = Object.values(users).find((u) => u.token === token);
  if (user) {
    delete user.token;
    console.log('User logged out:', user.email);
  }
  res.status(204).end();
});

// Get Scores
apiRouter.get('/scores', (_req, res) => {
  res.send(scores);
});

// Submit Score
apiRouter.post('/score', (req, res) => {
  scores = updateScores(req.body, scores);
  res.send(scores);
});

// Catch-all route for unknown paths
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Function to handle updating scores
function updateScores(newScore, scores) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) scores.push(newScore);
  if (scores.length > 10) scores.length = 10;

  return scores;
}
