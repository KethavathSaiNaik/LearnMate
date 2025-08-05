import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `${user.token}`,
          },
        });
        setForm({ name: res.data.name, email: res.data.email, password: '' });
      } catch (error) {
        console.error('Failed to fetch profile:', error.response?.data || error.message);
        setStatusMsg('❌ Failed to fetch profile.');
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/users/me', form, {
        headers: {
          Authorization: `${user.token}`,
        },
      });
      setStatusMsg('✅ Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (error) {
      console.error('Profile update failed:', error.response?.data || error.message);
      setStatusMsg('❌ Failed to update profile.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow rounded-4 p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="text-center mb-4 fw-bold">
          👤 Edit Profile
        </h3>
        {statusMsg && <div className="alert alert-info text-center">{statusMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="example@domain.com"
              required
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">New Password <small className="text-muted">(optional)</small></label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep existing"
            />
          </div>

          <button className="btn btn-primary w-100 mt-2 fw-semibold" type="submit">
            💾 Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
