const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadPDF, summarizeDoc, chatWithDoc, generateQuiz, submitQuiz, getQuizHistory } = require("../controllers/fileController");
const { protect } = require("../middleware/authMiddleware")

router.post("/upload", protect, upload.single("file"), uploadPDF);
router.post("/summarize", protect, summarizeDoc);
router.post("/chat", protect, chatWithDoc);
router.post("/generate-quiz", protect, generateQuiz);
router.post("/submit-quiz", protect, submitQuiz);
router.get("/quiz-history", protect, getQuizHistory);


module.exports = router;
