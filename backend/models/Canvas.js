const mongoose = require('mongoose');

const Canvas = new mongoose.Schema({
  email: String,
  canvas: String,
  title: String,
});

module.exports = mongoose.model('Canvas', Canvas);
