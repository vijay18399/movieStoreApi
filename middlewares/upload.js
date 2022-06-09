const multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-result-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage });
module.exports = uploadFile;
