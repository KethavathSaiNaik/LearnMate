const Summary = require('../models/Summary');

exports.saveSummary = async (req, res) => {
    try {
        const { document_name, summary_text } = req.body;
        const user_id = req.user.id; // coming from protect middleware

        if (!summary_text) {
            return res.status(400).json({ error: 'Summary text is required' });
        }

        const summary = new Summary({
            user_id,
            document_name: document_name || 'Untitled',
            summary_text,
        });

        await summary.save();
        res.status(201).json({ message: '✅ Summary saved successfully', summary });
    } catch (err) {
        console.error('Save Summary Error:', err);
        res.status(500).json({ error: 'Server error while saving summary' });
    }
};

exports.getUserSummaries = async (req, res) => {
    try {
        const user_id = req.user.id;
        const summaries = await Summary.find({ user_id }).sort({ createdAt: -1 });

        res.json(summaries);
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching summaries' });
    }
};

exports.getSummaryById = async (req, res) => {
    try {
        const summary = await Summary.findOne({
            _id: req.params.id,
            user_id: req.user.id,
        });

        if (!summary) {
            return res.status(404).json({ error: 'Summary not found' });
        }

        res.json({ summary });
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching summary' });
    }
};
