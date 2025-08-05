const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        document_name: {
            type: String,
            default: 'Untitled',
        },
        summary_text: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Summary', summarySchema);
