const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "internship-system",
    resource_type: "auto", // PDF + images දෙකටම
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

const upload = multer({ storage });

module.exports = upload;