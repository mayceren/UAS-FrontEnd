const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  users_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

// Virtual field untuk relasi days
itinerarySchema.virtual('days', {
  ref: 'Day',
  localField: '_id',
  foreignField: 'itinerary_id',
});

itinerarySchema.set('toJSON', { virtuals: true });
itinerarySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);
