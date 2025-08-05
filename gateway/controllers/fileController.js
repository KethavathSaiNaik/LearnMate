const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const QuizHistory = require("../models/QuizHistory");

exports.uploadPDF = async (req, res) => {
    try {
        const { session_id } = req.body;
        if (!req.file) return res.status(400).json({ error: "No file uploaded." });

        const filePath = req.file.path;
        const form = new FormData();
        form.append("file", fs.createReadStream(filePath));
        form.append("session_id", session_id);

        const response = await axios.post(`${FASTAPI_URL}/upload/`, form, {
            headers: form.getHeaders()
        });

        fs.unlinkSync(filePath); // cleanup
        res.status(200).json(response.data);
    } catch (err) {
        console.error("Upload Error:", err.message);
        res.status(500).json({ error: "❌ Upload failed" });
    }
};

exports.summarizeDoc = async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({ error: "session_id is required" });
        }

        const FormData = require("form-data");
        const form = new FormData();
        form.append("session_id", session_id);

        const response = await axios.post(`${FASTAPI_URL}/summarize/`, form, {
            headers: form.getHeaders(),
        });

        return res.status(200).json(response.data);
    } catch (err) {
        console.error("Summarize Error:", err.message);
        return res.status(500).json({ error: "❌ Summarization failed" });
    }
};

exports.chatWithDoc = async (req, res) => {
    try {
        const { session_id, query } = req.body;

        if (!session_id || !query) {
            return res.status(400).json({ error: "session_id and query are required" });
        }

        const FormData = require("form-data");
        const form = new FormData();
        form.append("session_id", session_id);
        form.append("query", query);

        const response = await axios.post(`${FASTAPI_URL}/chat/`, form, {
            headers: form.getHeaders(),
        });

        return res.status(200).json(response.data);
    } catch (err) {
        console.error("Chat Error:", err.message);
        return res.status(500).json({ error: "❌ Chat request failed" });
    }
};

exports.generateQuiz = async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({ error: "session_id is required" });
        }

        const FormData = require("form-data");
        const form = new FormData();
        form.append("session_id", session_id);

        const response = await axios.post(`${FASTAPI_URL}/generate_quiz/`, form, {
            headers: form.getHeaders(),
        });

        let rawOutput = response.data?.quiz || response.data;

        // If response is a string (likely raw model output)
        if (typeof rawOutput === "string") {
            // Clean up markdown formatting if present (```json ... ```)
            rawOutput = rawOutput.trim();
            if (rawOutput.startsWith("```")) {
                rawOutput = rawOutput.replace(/^```json|^```/, "").replace(/```$/, "").trim();
            }

            try {
                const parsed = JSON.parse(rawOutput);
                return res.status(200).json({ quiz: parsed });
            } catch (parseErr) {
                return res.status(500).json({
                    error: `❌ Failed to parse quiz JSON: ${parseErr.message}`,
                    raw_output: rawOutput.slice(0, 1000),
                });
            }
        }

        // If already parsed quiz array
        return res.status(200).json({ quiz: rawOutput });
    } catch (err) {
        console.error("Quiz Generation Error:", err.message);
        return res.status(500).json({ error: "❌ Failed to generate quiz" });
    }
};


exports.submitQuiz = async (req, res) => {
    try {
        const { session_id, answers } = req.body;

        const response = await axios.post(`${FASTAPI_URL}/submit_quiz/`, {
            session_id,
            answers,
        });

        const result = response.data;

        // 🔐 Save to DB if user is logged in
        if (req.user && req.user.id) {
            await QuizHistory.create({
                userId: req.user.id,
                sessionId: session_id,
                score: result.score,
                total: result.total,
                details: result.details,
            });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error("Quiz Submission Error:", err.message);
        return res.status(500).json({ error: "❌ Failed to submit and evaluate quiz" });
    }
};
exports.getQuizHistory = async (req, res) => {
    try {
        const history = await QuizHistory.find({ userId: req.user.id }).sort({ createdAt: -1 });

        const simplified = history.map(entry => ({
            score: entry.score,
            total: entry.total,
            sessionId: entry.sessionId,
            date: entry.createdAt,
        }));

        return res.status(200).json(simplified);
    } catch (err) {
        console.error("Fetch History Error:", err.message);
        return res.status(500).json({ error: "❌ Could not fetch quiz history" });
    }
};
