import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Footer from '../components/Footer';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100); // Delay entry
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (user?.token) {
      navigate('/upload-pdf');
    } else {
      navigate('/login');
    }
  };

  const fadeInStyle = {
    opacity: showContent ? 1 : 0,
    transform: showContent ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.6s ease-out',
  };

  const featureAnimation = (delay) => ({
    opacity: showContent ? 1 : 0,
    transform: showContent ? 'scale(1)' : 'scale(0.95)',
    transition: `all 0.6s ease-out ${delay}s`,
  });

  const buttonHoverStyle = {
    transition: 'transform 0.2s ease-in-out',
  };

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      {/* Hero Section */}
      <div className="text-center" style={fadeInStyle}>
        <h1 className="display-4 fw-bold mb-3">
          Welcome to <span className="text-primary">LearnMate-AI</span>
        </h1>
        <p className="lead text-muted mb-4">
          Your personalized AI-powered learning companion — Upload, Chat, Summarize & Quiz your documents instantly.
        </p>

        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
          <button
            className="btn btn-primary btn-lg px-4"
            onClick={handleGetStarted}
            style={buttonHoverStyle}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            🚀 Get Started
          </button>
          <Link
            to="/about"
            className="btn btn-outline-secondary btn-lg px-4"
            style={buttonHoverStyle}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            📘 Learn More
          </Link>
        </div>
      </div>

      <hr className="w-100 my-5" />

      {/* Feature Highlights */}
      <div className="row text-center">
        <div className="col-md-3 mb-4" style={featureAnimation(0)}>
          <h5>📄 Upload PDFs</h5>
          <p className="text-muted">Easily upload your study material or notes to begin learning.</p>
        </div>
        <div className="col-md-3 mb-4" style={featureAnimation(0.1)}>
          <h5>💬 Chat with Docs</h5>
          <p className="text-muted">Ask questions and get smart responses from your document's content.</p>
        </div>
        <div className="col-md-3 mb-4" style={featureAnimation(0.2)}>
          <h5>🧾 Auto-Summarize</h5>
          <p className="text-muted">Let AI generate clean summaries to revise faster.</p>
        </div>
        <div className="col-md-3 mb-4" style={featureAnimation(0.3)}>
          <h5>🧠 Generate Quizzes</h5>
          <p className="text-muted">Test your knowledge with AI-generated quizzes tailored to your documents.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
