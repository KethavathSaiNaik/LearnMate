// routes/AdminRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AdminRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    // Check if not logged in or not admin
    if (!user || user.user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
}

export default AdminRoute;
