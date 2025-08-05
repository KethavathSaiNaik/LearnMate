import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate(); // ✅ Initialize navigation

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `${user.token}`
          }
        });
        setProfile(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
      }
    };
    fetchProfile();
  }, [user]);

  const handleEditProfile = () => {
    navigate('/edit-profile'); // ✅ Redirect to Edit Profile page
  };

  if (!profile) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mb-4 border-0 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary fw-bold">Your Profile</h2>
          <button className="btn btn-outline-primary" onClick={handleEditProfile}>
            ✏️ Edit Profile
          </button>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <p className="mb-2"><strong>Name:</strong></p>
            <div className="form-control bg-light">{profile.name}</div>
          </div>
          <div className="col-md-6 mb-3">
            <p className="mb-2"><strong>Email:</strong></p>
            <div className="form-control bg-light">{profile.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
