const Day = require('../models/day.model');
const Itinerary = require('../models/itinerary.model');

// Mendapatkan daftar hari berdasarkan itinerary_id
const getDays = async (req, res) => {
    const itineraryId = req.params.itineraryId;
  
    try {
      const days = await Day.find({ itinerary_id: itineraryId })
        .populate('itinerary_id', 'title location');
  
      if (!days || days.length === 0) {
        return res.status(404).json({ message: 'Days not found for this itinerary' });
      }
  
      res.status(200).json(days);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch days', details: err.message });
    }
  };
  


// Menambahkan hari baru
const addDay = async (req, res) => {
    const { itinerary_id, pagi, siang, sore, malam } = req.body;
    try {
        // Validasi itinerary_id
        const itineraryExists = await Itinerary.findById(itinerary_id);
        if (!itineraryExists) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }

        // Simpan hari baru
        const newDay = new Day({ itinerary_id, pagi, siang, sore, malam });
        await newDay.save();
        res.status(201).json(newDay);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create day', details: err.message });
    }
};


module.exports = { getDays, addDay };
