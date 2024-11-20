const config = require('../mongoTest/dbConfig.json');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;