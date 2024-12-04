const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    url_map: { type: String },
    location: { type: String },
    isFavorite: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Destination', destinationSchema);
