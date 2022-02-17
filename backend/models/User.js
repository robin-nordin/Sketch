const mongoose = require('mongoose');

// Defines what type of information we want to registrate with
const User = new mongoose.Schema({
  email: String,
  password: String,
});

module.exports = mongoose.model('User', User);
