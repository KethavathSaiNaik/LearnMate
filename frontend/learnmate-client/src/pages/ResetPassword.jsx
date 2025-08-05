import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [step, setStep] = useState(1); // Step 1: enter email → Step 2: show question and form
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/get-security-question', { email });

            // ✅ FIXED: Extract the question string correctly
            setSecurityQuestion(res.data.securityQuestion);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch security question');
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
                email,
                securityAnswer,
                newPassword
            });
            setSuccess(res.data.message || 'Password reset successful!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed');
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg,  #e3f2fd, #bbdefb)',
                paddingBottom: '160px',
            }}
        >
            <div className="card shadow-lg p-4" style={{ maxWidth: '420px', width: '100%' }}>
                <h2 className="mb-4 text-center">Reset Password 🔐</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="mb-3">
                            <label>Enter your registered email</label>
                            <input
                                type="email"
                                className="form-control"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-info w-100">Next</button>
                    </form>
                ) : (
                    <form onSubmit={handleResetSubmit}>
                        <div className="mb-3">
                            <label>Security Question</label>
                            <input
                                type="text"
                                className="form-control"
                                value={securityQuestion}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label>Your Answer</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <small className="form-text text-muted">
                                At least 8 characters, including a number and special character.
                            </small>
                        </div>

                        <button type="submit" className="btn btn-danger w-100">Reset Password</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
