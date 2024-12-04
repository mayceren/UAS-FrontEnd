const Itinerary = require('../models/itinerary.model');
const Day = require('../models/day.model');
const Favorite = require('../models/favorite.model');

// Mendapatkan semua itinerary beserta days
const getAllItinerariesWithDays = async (req, res) => {
  try {
    const itineraries = await Itinerary.find()
      .populate({
        path: 'users_id',
        select: 'name email role',
      })
      .populate({
        path: 'days',
        select: 'pagi siang sore malam created_at'
      });

    const itinerariesWithFavorites = itineraries.map(itinerary => ({
      ...itinerary.toObject(),
      isFavorite: false,
      days: itinerary.days
    }));

    res.status(200).json(itinerariesWithFavorites);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching itineraries', error: err.message });
  }
};


// Mendapatkan semua itinerary beserta days menggunakan auth
const getAllItinerariesWithAuthAndDays = async (req, res) => {
  try {
    const userId = req.user.userId;

    const itineraries = await Itinerary.find()
      .populate({
        path: 'users_id',
        select: 'name email role',
      })
      .populate({
        path: 'days',
        select: 'pagi siang sore malam created_at'
      });

    const itinerariesWithFavoritesAndDays = await Promise.all(
      itineraries.map(async (itinerary) => {
        const isFavorite = await Favorite.exists({
          users_id: userId,
          itinerary_id: itinerary._id
        });

        return {
          ...itinerary.toObject(),
          isFavorite: isFavorite ? true : itinerary.isFavorite,
          days: itinerary.days
        };
      })
    );

    res.status(200).json(itinerariesWithFavoritesAndDays);
  } catch (err) {
    console.error('Error fetching itineraries with days:', err);
    res.status(500).json({ message: 'Error fetching itineraries', error: err.message });
  }
};

const getItinerariesByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID from request:", userId);

    const itineraries = await Itinerary.find({ users_id: userId })
      .populate({
        path: 'users_id',
        select: 'name email role'
      })
      .populate({
        path: 'days',
        select: 'pagi siang sore malam created_at'
      });

    console.log("Itineraries found:", itineraries);

    if (itineraries.length === 0) {
      return res.status(404).json({ message: 'No itineraries found for the user' });
    }


    res.status(200).json(itineraries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching itineraries by user', error: err.message });
  }
};


// Mendapatkan itinerary tertentu beserta days-nya dan data user
const getItineraryWithDaysById = async (req, res) => {
  try {
    const itineraryId = req.params.id;

    const itinerary = await Itinerary.findById(itineraryId)
      .populate({
        path: 'users_id',
        select: 'name email role',
      })
      .populate({
        path: 'days',
        select: 'pagi siang sore malam created_at'
      });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json(itinerary);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching itinerary', error: err.message });
  }
};

// Mendapatkan itinerary tertentu beserta days-nya dan data user dengan auth
const getItineraryWithDaysByIdWithAuth = async (req, res) => {
  const userId = req.user.userId;
  const itineraryId = req.params.id;

  try {
    // Ambil itinerary berdasarkan ID dan populate data users_id serta days
    const itinerary = await Itinerary.findById(itineraryId)
      .populate({
        path: 'users_id',
        select: 'name email role',
      })
      .populate({
        path: 'days',
        select: 'pagi siang sore malam created_at',
      });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Cek apakah itinerary ini ada di daftar favorit user
    const isFavorite = await Favorite.exists({
      users_id: userId,
      itinerary_id: itineraryId
    });

    // Set isFavorite berdasarkan hasil pengecekan
    itinerary.isFavorite = isFavorite ? true : itinerary.isFavorite;

    // Kembalikan itinerary dengan status isFavorite yang sudah ditentukan dan data days
    res.status(200).json(itinerary);
  } catch (err) {
    console.error('Error fetching itinerary by ID:', err);
    res.status(500).json({ message: 'Error fetching itinerary', error: err.message });
  }
};


const addItinerary = async (req, res) => {
  try {
    const { users_id, title, location, days } = req.body;

    // Validasi input
    if (!users_id || !title || !location || !Array.isArray(days)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Simpan itinerary ke database
    const itinerary = new Itinerary({
      users_id,
      title,
      location,
    });

    const savedItinerary = await itinerary.save();

    // Simpan days yang terkait
    const daysWithItineraryId = days.map(day => ({
      ...day,
      itinerary_id: savedItinerary._id
    }));

    const savedDays = await Day.insertMany(daysWithItineraryId);

    res.status(201).json({
      message: 'Itinerary and days added successfully',
      itinerary: savedItinerary,
      days: savedDays
    });
  } catch (err) {
    res.status(500).json({ message: 'Error adding itinerary', error: err.message });
  }
};


const updateItineraryWithDays = async (req, res) => {
  try {
    const itineraryId = req.params.id;
    const { title, location, days } = req.body;
    const userId = req.user.id;

    // Validasi input
    if (!title || !location || !Array.isArray(days)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Cek apakah itinerary ini milik user
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary || itinerary.users_id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this itinerary' });
    }

    // Update itinerary (judul dan lokasi)
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      itineraryId,
      { title, location },
      { new: true }
    );

    if (days && days.length > 0) {
      await Day.deleteMany({ itinerary_id: itineraryId });

      // Tambahkan days baru
      const daysWithItineraryId = days.map(day => ({ ...day, itinerary_id: itineraryId }));
      const savedDays = await Day.insertMany(daysWithItineraryId);

      return res.status(200).json({
        message: 'Itinerary and days updated successfully',
        itinerary: updatedItinerary,
        days: savedDays,
      });
    }

    // Jika tidak ada perubahan pada days
    res.status(200).json({
      message: 'Itinerary updated successfully',
      itinerary: updatedItinerary,
    });

  } catch (err) {
    res.status(500).json({ message: 'Error updating itinerary', error: err.message });
  }
};

const deleteItineraryWithDays = async (req, res) => {
  try {
    const itineraryId = req.params.id;
    const userId = req.user.id;

    // Cek apakah itinerary ini milik user
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary || itinerary.users_id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this itinerary' });
    }

    // Hapus days terkait dengan itinerary
    await Day.deleteMany({ itinerary_id: itineraryId });

    // Hapus itinerary
    await Itinerary.findByIdAndDelete(itineraryId);

    res.status(200).json({ message: 'Itinerary and associated days deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting itinerary', error: err.message });
  }
};


module.exports = {
  getAllItinerariesWithDays,
  getItineraryWithDaysById,
  getItinerariesByUser,
  addItinerary,
  getAllItinerariesWithAuthAndDays,
  getItineraryWithDaysByIdWithAuth,
  updateItineraryWithDays,
  deleteItineraryWithDays,
}