const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  itinerary_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary', required: true },
  pagi: { type: String },
  siang: { type: String },
  sore: { type: String },
  malam: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Day', daySchema);
