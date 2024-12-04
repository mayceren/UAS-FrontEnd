const express = require('express');
const verifyToken = require('../middleware/authMiddleware'); // Middleware untuk proteksi token
const authController = require('../controllers/authController');
const favoriteController = require('../controllers/favoriteController');
const itineraryController = require('../controllers/itineraryController');
const dayController = require('../controllers/dayController');
const userController = require('../controllers/userController');
const destinationController = require('../controllers/destionationController');
const { upload } = require('../middleware/upload');
const checkPermission = require('../middleware/checkPermission');

const router = express.Router();

// Rute untuk Register dan Login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rute untuk User
router.get('/user/:id', verifyToken, userController.getUserById);
router.put('/user/:id', verifyToken, checkPermission, userController.updateUser);
router.delete('/user/:id', verifyToken, checkPermission, userController.deleteUser);

// Rute untuk Destionation
router.get('/destination', destinationController.getAllDestinations);
router.get('/destination/:id', destinationController.getDestinationById);
router.get('/destinations', verifyToken, destinationController.getAllDestinationsWithAuth);
router.get('/destinations/:id', verifyToken, destinationController.getDestinationByIdWithAuth);
router.post('/destination', verifyToken, upload, destinationController.addDestination);
router.put('/destination/:id', verifyToken, upload, destinationController.updateDestination);
router.delete('/destination/:id', verifyToken, destinationController.deleteDestination);

// Rute untuk Favorite
router.get('/favorites/:userId', verifyToken, favoriteController.getFavorites);
router.post('/favorites', verifyToken, favoriteController.toggleFavorite);

// Rute untuk Itinerary
router.get('/itineraries', itineraryController.getAllItinerariesWithDays);
router.get('/itineraries/:id', itineraryController.getItineraryWithDaysById);
router.get('/itinerary', verifyToken, itineraryController.getAllItinerariesWithAuthAndDays);
router.get('/your-itinerary', verifyToken, itineraryController.getItinerariesByUser);
router.get('/itinerary/:id', verifyToken, itineraryController.getItineraryWithDaysByIdWithAuth);
router.post('/itineraries', verifyToken, itineraryController.addItinerary);
router.put('/itineraries/:id', verifyToken, itineraryController.updateItineraryWithDays);
router.delete('/itineraries/:id', verifyToken, itineraryController.deleteItineraryWithDays);

// Rute untuk Day
router.get('/days/:itineraryId', dayController.getDays);
router.post('/days', verifyToken, dayController.addDay);

module.exports = router;
