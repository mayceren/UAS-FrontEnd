const User = require('../models/user.model');

// Middleware untuk memeriksa apakah pengguna memiliki akses (pembuat atau admin)
const checkPermission = async (req, res, next) => {
    const userId = req.params.id;
    const loggedInUserId = req.user.id; // Gunakan `req.user.id` atau `req.user.userId` tergantung token
    const userRole = req.user.role;

    console.log('Logged In User ID:', loggedInUserId);
    console.log('User Role:', userRole);
    console.log('Requested User ID:', userId);

    if (userRole === 'admin' || loggedInUserId === userId) {
        return next();
    }

    return res.status(403).json({ message: 'Unauthorized to perform this action' });
};



module.exports = checkPermission;
