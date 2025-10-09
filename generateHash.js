// Run this script once to generate the hash
// Create a file called generateHash.js and run: node generateHash.js

const bcrypt = require('bcryptjs');

const password = 'Obanla198175%';

bcrypt.hash(password, 10, function(err, hash) {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nCopy this hash and use it in your admin page code');
  }
});