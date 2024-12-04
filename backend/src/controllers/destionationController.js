const Destination = require('../models/destination.model');
const cloudinary = require('../config/cloudinary');
const Favorite = require('../models/favorite.model');

// Mendapatkan semua destinasi
const getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();

        const destinationsWithFavorites = destinations.map(destination => ({
            ...destination.toObject(),
            isFavorite: false,
        }));

        res.status(200).json(destinationsWithFavorites);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching destinations', error: err.message });
    }
};


const getAllDestinationsWithAuth = async (req, res) => {
    try {
        const userId = req.user.userId;
        const destinations = await Destination.find();

        const destinationsWithFavorites = await Promise.all(
            destinations.map(async (destination) => {
                const isFavorite = await Favorite.exists({
                    users_id: userId,
                    destination_id: destination._id
                });
                return {
                    ...destination.toObject(),
                    isFavorite: isFavorite ? true : destination.isFavorite // Gunakan isFavorite dari Favorite jika ada
                };
            })
        );

        res.status(200).json(destinationsWithFavorites);
    } catch (err) {
        console.error('Error fetching destinations:', err);
        res.status(500).json({ message: 'Error fetching destinations', error: err.message });
    }
};



// Mendapatkan destinasi berdasarkan ID
const getDestinationById = async (req, res) => {
    try {
        const destinationId = req.params.id;
        const destination = await Destination.findById(destinationId);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        res.status(200).json(destination);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching destination', error: err.message });
    }
};

const getDestinationByIdWithAuth = async (req, res) => {
    const userId = req.user.userId;

    try {
        const destinationId = req.params.id;
        const destination = await Destination.findById(destinationId);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        const isFavorite = await Favorite.exists({
            users_id: userId,
            destination_id: destination._id
        });

        res.status(200).json({
            ...destination.toObject(),
            isFavorite: !!isFavorite
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching destination', error: err.message });
    }
};


const addDestination = async (req, res) => {
    const { title, description, url_map, location } = req.body;
    const image = req.file;  // Gambar yang diupload menggunakan multer

    // Validasi input data
    if (!title || !description || !image || !url_map || !location) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Upload gambar ke Cloudinary
        const imageUrl = await cloudinary.uploadToCloudinary(image.path);

        // Membuat destinasi baru dengan URL gambar dari Cloudinary
        const newDestination = new Destination({
            title,
            description,
            image: imageUrl,  // Ganti dengan URL gambar dari Cloudinary
            url_map,
            location,
            isFavorte: false,
        });

        // Simpan destinasi baru ke MongoDB
        await newDestination.save();

        res.status(201).json({
            message: 'Destination added successfully',
            destination: newDestination
        });
    } catch (err) {
        console.error('Error adding destination:', err);
        res.status(500).json({ error: 'Failed to add destination', details: err.message });
    }
};

const updateDestination = async (req, res) => {
    const { id } = req.params;
    const { title, description, url_map, location } = req.body;
    const image = req.file;
    console.log("id destination : ", id);


    try {
        const destination = await Destination.findById(id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        // Jika gambar diunggah, upload ke Cloudinary
        let imageUrl = destination.image;
        if (image) {
            imageUrl = await cloudinary.uploadToCloudinary(image.path);
        }

        // Perbarui data destinasi
        const updatedDestination = await Destination.findByIdAndUpdate(
            id,
            {
                title: title || destination.title,
                description: description || destination.description,
                image: imageUrl,
                url_map: url_map || destination.url_map,
                location: location || destination.location,
            },
            { new: true } // Mengembalikan data yang diperbarui
        );

        res.status(200).json({
            message: 'Destination updated successfully',
            destination: updatedDestination,
        });
    } catch (err) {
        console.error('Error updating destination:', err);
        res.status(500).json({ error: 'Failed to update destination', details: err.message });
    }
};


const deleteDestination = async (req, res) => {
    const { id } = req.params;

    try {
        // Cari dan hapus destinasi berdasarkan ID
        const deletedDestination = await Destination.findByIdAndDelete(id);

        if (!deletedDestination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        res.status(200).json({
            message: 'Destination deleted successfully',
            destination: deletedDestination,
        });
    } catch (err) {
        console.error('Error deleting destination:', err);
        res.status(500).json({ error: 'Failed to delete destination', details: err.message });
    }
};


module.exports = {
    getAllDestinations,
    getDestinationById,
    getAllDestinationsWithAuth,
    getDestinationByIdWithAuth,
    addDestination,
    updateDestination,
    deleteDestination,
}