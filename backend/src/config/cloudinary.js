const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dwrvtg90t',
    api_key: '223841577552675',
    api_secret: 'OuponFeCBqC_wmySFoFAjIyl5aI'
});

const uploadToCloudinary = async (imagePath) => {
    try {
        const result = await cloudinary.uploader.upload(imagePath);
        return result.secure_url;
    } catch (err) {
        console.error('Cloudinary upload error:', err);
        throw new Error('Failed to upload image to Cloudinary');
    }
};

module.exports = { uploadToCloudinary };