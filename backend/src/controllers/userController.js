const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Mendapatkan data user berdasarkan ID
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data', error: err.message });
  }
};

// Update user data
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Existing User:', user); // Debug user data sebelum diperbarui
    console.log('Request Body:', req.body); // Debug data yang diterima

    if (name) {
      user.name = name;
      console.log('Updated Name:', user.name); // Debug perubahan nama
    }
    if (email) {
      user.email = email;
      console.log('Updated Email:', user.email); // Debug perubahan email
    }
    if (password) {
      // const salt = await bcrypt.genSalt(10);
      // user.password = await bcrypt.hash(password, salt);
      user.password = password;
      console.log('Updated Password (hashed):', user.password); // Debug perubahan password
    }

    // Simpan perubahan
    await user.save();
    console.log('User After Save:', user); // Debug data setelah disimpan

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err); // Debug error
    res.status(500).json({ message: 'Error updating user data', error: err.message });
  }
};


// Delete user by ID
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user data', error: err.message });
  }
};

module.exports = { getUserById, updateUser, deleteUser };
