const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");

// Auto-create uploads/ directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
    const allowed = /pdf/;
    const isValid =
        allowed.test(path.extname(file.originalname).toLowerCase()) &&
        allowed.test(file.mimetype);
    isValid ? cb(null, true) : cb("❌ Only PDF files allowed!");
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
