import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function SummaryViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const token = user?.token;

    const [summary, setSummary] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/summary/${id}`, {
                    headers: { Authorization: token },
                });
                setSummary(res.data.summary);
            } catch (err) {
                console.error(err);
                setError('❌ Failed to load summary.');
            }
        };

        if (token) fetchSummary();
    }, [id, token]);

    const handleBack = () => {
        navigate(-1);  // Go back to the previous page
    };

    if (error) return <p>{error}</p>;
    if (!summary) return <p>⏳ Loading summary...</p>;

    return (
        <div className="container my-4">
            <button className="btn btn-outline-secondary mb-3" onClick={handleBack}>
                ← Go Back
            </button>

            <h3 className="mb-4">📄 {summary.document_name}</h3>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    {renderCleanSummary(summary.summary_text)}
                </div>
            </div>
        </div>
    );
}

// Same renderCleanSummary function as before
function renderCleanSummary(text) {
    const sections = text.split(/\n(?=\d+\.\s)/);

    return sections.map((section, idx) => {
        const lines = section.trim().split('\n').filter(Boolean);
        if (lines.length === 0) return null;

        const headingLine = lines[0];
        const title = headingLine.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim();

        let summary = '';
        const keyIdeas = [];

        for (let line of lines.slice(1)) {
            if (/^\*?\s*\*\*Key Ideas:\*\*/i.test(line.trim())) continue;

            const match = line.match(/^\*?\s*\**([\w\s\-\/]+?)\**\s*:\s*(.+)/);
            if (match) {
                const term = match[1].trim().replace(/\*\*/g, '');
                const desc = match[2].trim().replace(/\*\*/g, '');
                if (/^summary$/i.test(term)) {
                    summary = desc;
                } else {
                    keyIdeas.push(`<strong>${term}:</strong> ${desc}`);
                }
            } else if (line.trim().startsWith('*')) {
                const raw = line.replace(/^\*\s*/, '').replace(/\*\*/g, '').trim();
                keyIdeas.push(raw);
            }
        }

        return (
            <div key={idx} className="mb-4">
                <h5 className="fw-bold">{idx + 1}. {title}</h5>
                {summary && <p><strong>Summary:</strong> {summary}</p>}
                {keyIdeas.length > 0 && (
                    <div>
                        <p className="mb-1 fw-semibold">Key Ideas:</p>
                        <ul className="ms-4">
                            {keyIdeas.map((idea, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: idea }} />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    });
}

export default SummaryViewer;
