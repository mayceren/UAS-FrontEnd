const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key';

// Middleware untuk memverifikasi token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Received Token:', token);

  if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded Token:', decoded);
      
      // Sesuaikan struktur req.user
      req.user = {
          id: decoded.id || decoded.userId, // Gunakan `decoded.id` jika tersedia, atau `userId`
          role: decoded.role, // Tambahkan role jika token menyertakannya
      };
      next();
  } catch (err) {
      console.error('Token verification failed:', err.message);
      res.status(400).json({ message: 'Token is not valid' });
  }
};



module.exports = verifyToken;
