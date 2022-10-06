const multer = require("multer");
const randomize = require("randomatic");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const name = randomize("Aa0", 10);
    callback(null, name + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
