const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  users_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: false },
  itinerary_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary', required: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
