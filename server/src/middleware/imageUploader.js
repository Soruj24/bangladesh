const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept only certain file types, e.g., images
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false); // Reject the file
  }
};

const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB
  };

const upload = multer({ 
  storage: storage,
    limits: limits, // Attach the limits
  fileFilter: fileFilter, // Attach the fileFilter
});

module.exports = upload;
