import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function AdminDashboard() {
    const { user } = useContext(AuthContext);

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 5;

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: {
                        Authorization: `${user.token}`
                    }
                });
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };

        fetchStats();
    }, [user.token]);

    // Fetch paginated users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/admin/users?page=${page}&limit=${limit}`,
                    {
                        headers: {
                            Authorization: `${user.token}`
                        }
                    }
                );
                setUsers(res.data.users);
                setTotalPages(res.data.pages);
            } catch (err) {
                console.error('Failed to fetch users', err);
            }
        };

        fetchUsers();
    }, [page, user.token]);

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    if (!stats) return <div className="container mt-4">Loading dashboard...</div>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">Admin Dashboard</h2>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm">
                        <h5>Total Users</h5>
                        <h2>{stats.totalUsers}</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm">
                        <h5>Total Saved Summaries</h5>
                        <h2>{stats.totalSummaries}</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center p-3 shadow-sm">
                        <h5>Total Quizzes attempted</h5>
                        <h2>{stats.totalQuizzes}</h2>
                    </div>
                </div>
            </div>

            {/* All Users with Pagination */}
            <h4 className="mt-4">All Users</h4>
            <table className="table table-bordered mt-3">
                <thead className="table-light">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                                <span className="badge bg-secondary">{u.role}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                    className="btn btn-outline-primary"
                    disabled={page === 1}
                    onClick={handlePrev}
                >
                    &laquo; Prev
                </button>
                <span>
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                    className="btn btn-outline-primary"
                    disabled={page === totalPages}
                    onClick={handleNext}
                >
                    Next &raquo;
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;
