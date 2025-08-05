import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const securityQuestions = [
    'What is your favorite sport?',
    'What is your pet’s name?',

    'What is your favorite book?',
    'What was the name of your first school?'
  ];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccess(res.data.message || 'Signup successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd, #2c95ebff)',
        paddingBottom: '60px',
      }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '30px' }}>
        <h2 className="mb-4 text-center">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <small className="form-text text-muted">
              At least 8 characters, including a number and a special character.
            </small>
          </div>

          <div className="mb-3">
            <label>Security Question</label>
            <select
              name="securityQuestion"
              className="form-select"
              required
              value={formData.securityQuestion}
              onChange={handleChange}
            >
              <option value="">Select a question</option>
              {securityQuestions.map((q, idx) => (
                <option key={idx} value={q}>{q}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Security Answer</label>
            <input
              type="text"
              name="securityAnswer"
              className="form-control"
              required
              value={formData.securityAnswer}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
        <p className="mt-3 text-center">
          Already registered?{' '}
          <a href="/login" className="text-decoration-none text-primary fw-semibold">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
