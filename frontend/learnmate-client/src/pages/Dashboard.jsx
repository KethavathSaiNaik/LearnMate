import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleRedirect = () => {
    navigate('/upload-pdf');
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!user) return null;

  return (
    <div
  style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', // soft blue shades
    paddingTop: '40px',
    paddingBottom: '40px',
  }}
>
      <div className="container">
        <div className="card shadow p-4">
          <h2 className="mb-3">Welcome, {user.user.name} 🎉</h2>

          <hr />

          {/* Web App Info Section */}
          <div className="mt-4">
            <h5>Your personalized AI tutor — ready to explain, clarify, and quiz.</h5>
            <p>
              This intelligent learning assistant is designed to help students and learners boost their understanding of complex documents.
              Simply upload any PDF—be it textbooks, notes, or articles—and the app will summarize it, let you ask questions via an AI chatbot,
              and even generate quizzes based on the content to test your understanding. Perfect for exam prep, revision, or concept reinforcement.
            </p>
          </div>

          {/* Features Section */}
          <h5 className="mt-4">🚀 What You Can Do Here:</h5>
          <ul>
            <li>📄 <strong>Upload PDFs</strong> and get instant summarization of content and save the quick notes</li>
            <li>🤖 <strong>Chat with our AI Bot</strong> to ask doubts about your documents</li>
            <li>📝 <strong>Attempt quizzes</strong> generated from uploaded content</li>
            <li>📈 <strong>Track your performance</strong> with quiz history and scores</li>
          </ul>

          <div className="mt-4 text-center">
            <button onClick={handleRedirect} className="btn btn-primary">
              Upload now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
