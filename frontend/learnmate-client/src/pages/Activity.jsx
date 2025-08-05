import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import HistoryTab from '../components/HistoryTab';

function Activity() {
    const { user } = useContext(AuthContext);
    const [summaries, setSummaries] = useState([]);
    const [loadingSummaries, setLoadingSummaries] = useState(true);
    const [summaryError, setSummaryError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/summary/user', {
                    headers: { Authorization: user.token },
                });

                const summaryArray = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data.summaries)
                        ? res.data.summaries
                        : [];

                setSummaries(summaryArray);
            } catch (err) {
                console.error(err);
                setSummaryError('❌ Failed to fetch saved summaries.');
            }
            setLoadingSummaries(false);
        };

        fetchSummaries();
    }, [user.token]);

    const handleView = (summaryId) => {
        navigate(`/summary/${summaryId}`);
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4 border-0 rounded-4">
                <h2 className="mb-4 text-primary fw-bold text-center">📊 Activity Overview</h2>

                {/* Quiz History */}
                <div className="card-body">
                    <h5 className="text-secondary mb-3">Quiz Performance History</h5>
                    <HistoryTab token={user.token} />
                </div>

                {/* Saved Summaries */}
                <div className="mt-5">
                    <h5 className="text-secondary mb-3">📚 Your Saved Summaries</h5>

                    {loadingSummaries && <p className="text-center">⏳ Loading summaries...</p>}
                    {summaryError && <p className="text-danger text-center">{summaryError}</p>}
                    {!loadingSummaries && summaries.length === 0 && (
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
                                        (e.currentTarget.style.transform = 'scale(1.03)')}
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.transform = 'scale(1)')}
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

            </div>
        </div>
    );
}

export default Activity;
