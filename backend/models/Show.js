const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  time: { type: String, required: true }, // e.g., '10:00 AM'
  date: { type: Date, required: true },
  screen: { type: String, required: true }, // e.g., 'Screen 1'
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Show', showSchema);
