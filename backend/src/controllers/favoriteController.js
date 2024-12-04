const Favorite = require('../models/favorite.model');
const Itinerary = require('../models/itinerary.model');
const Destination = require('../models/destination.model');

// Mendapatkan daftar favorit berdasarkan user_id
const getFavorites = async (req, res) => {
  const userId = req.params.userId;

  try {
    const favorites = await Favorite.find({ users_id: userId })
      .populate('users_id', 'name email')
      .populate('destination_id', 'title description image url_map location')
      .populate({
        path: 'itinerary_id',
        select: 'title location created_at',
        populate: {
          path: 'days',
          select: 'pagi siang sore malam created_at'
        }
      });

    const favoritesWithUpdatedStatus = favorites.map(favorite => {
      // Tandai isFavorite untuk setiap destinasi dan itinerary
      if (favorite.destination_id) favorite.destination_id.isFavorite = true;
      if (favorite.itinerary_id) favorite.itinerary_id.isFavorite = true;

      return favorite;
    });

    res.status(200).json(favoritesWithUpdatedStatus);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites', details: err.message });
  }
};

// Menambahkan atau menghapus favorit
const toggleFavorite = async (req, res) => {
  const { users_id, destination_id, itinerary_id } = req.body;

  if (!users_id || (!destination_id && !itinerary_id)) {
    return res.status(400).json({ error: 'User ID and at least one of destination_id or itinerary_id are required' });
  }

  try {
    const existingFavorite = await Favorite.findOne({
      users_id,
      ...(destination_id && { destination_id }),
      ...(itinerary_id && { itinerary_id })
    });

    if (existingFavorite) {
      // Jika favorit sudah ada, hapus dan perbarui status
      await Favorite.deleteOne({ _id: existingFavorite._id });
      if (destination_id) await Destination.findByIdAndUpdate(destination_id, { isFavorite: false });
      if (itinerary_id) await Itinerary.findByIdAndUpdate(itinerary_id, { isFavorite: false });
      return res.status(200).json({ message: 'Favorite removed successfully' });
    }

    // Jika belum ada, tambahkan sebagai favorit baru
    const newFavorite = new Favorite({ users_id, destination_id, itinerary_id });
    await newFavorite.save();
    if (destination_id) await Destination.findByIdAndUpdate(destination_id, { isFavorite: true });
    if (itinerary_id) await Itinerary.findByIdAndUpdate(itinerary_id, { isFavorite: true });

    res.status(201).json({ message: 'Favorite added successfully', favorite: newFavorite });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle favorite', details: err.message });
  }
};

module.exports = { getFavorites, toggleFavorite };
