const mongoose = require("mongoose");

const quizHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sessionId: String,
        score: Number,
        total: Number,
        details: [
            {
                question: String,
                selected: String,
                correct: String,
                is_correct: Boolean,
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("QuizHistory", quizHistorySchema);
