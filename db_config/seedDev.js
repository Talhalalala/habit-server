const db = require('./config');
const fs = require('fs');

const seeds = fs.readFileSync(__dirname + '/_seeds.sql').toString();

db.query(seeds, () => console.log('Dev database seeded'));