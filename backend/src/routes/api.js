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

// Rute untuk Favorite
router.get('/favorites/:userId', verifyToken, favoriteController.getFavorites);
router.post('/favorites', verifyToken, favoriteController.toggleFavorite);

module.exports = router;
