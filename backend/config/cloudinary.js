const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'b2bbaprl',
  api_key: 141629627838665,
  api_secret: 'xPxQ4F-SshN977bT6l7aWapVPIo',
});

module.exports = cloudinary;