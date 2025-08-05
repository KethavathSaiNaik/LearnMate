import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function History({ token }) {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/summary/user', {
                    headers: { Authorization: token },
                });

                const summaryArray = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data.summaries)
                        ? res.data.summaries
                        : [];

                setSummaries(summaryArray);
            } catch (err) {
                console.error(err);
                setError('❌ Failed to fetch saved summaries.');
            }
            setLoading(false);
        };

        fetchSummaries();
    }, [token]);

    const handleView = (summaryId) => {
        navigate(`/summary/${summaryId}`);
    };

    return (
        <div className="container my-4">
            <h3 className="mb-4 fw-bold text-center text-primary">
                📚 Your Saved Summaries
            </h3>

            {loading && <p className="text-center">⏳ Loading summaries...</p>}
            {error && <p className="text-danger text-center">{error}</p>}
            {!loading && summaries.length === 0 && (
                <p className="text-muted text-center">📭 No saved summaries found.</p>
            )}

            <div className="row g-4">
                {summaries.map((summary) => (
                    <div key={summary._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div
                            className="card h-100 shadow border-0 rounded-4 p-3 bg-white position-relative"
                            onClick={() => handleView(summary._id)}
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = 'scale(1.03)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = 'scale(1)')
                            }
                        >
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 className="text-primary text-truncate mb-2 fw-semibold text-center">
                                        {summary.document_name || 'Untitled'}
                                    </h5>
                                    <p className="text-muted small mb-1 text-center">
                                        {new Date(summary.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-end mt-3">
                                    <span className="text-info fw-semibold small">
                                        View Summary →
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;
