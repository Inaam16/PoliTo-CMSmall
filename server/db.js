
const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('csmall.db', (err) => {
  if (err) throw err;
});

module.exports = db;