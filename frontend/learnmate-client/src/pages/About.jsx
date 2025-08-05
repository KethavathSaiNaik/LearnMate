function About() {
  return (
    <>
      {/* Bounce Zoom on Hover Styles */}
      <style>{`
        .card-hover-bounce {
          transition: transform 0.3s ease-in-out;
          cursor: pointer;
        }

        .card-hover-bounce:hover {
          transform: scale(1.07);
        }
      `}</style>

      <div className="container mt-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold">About LearnMate-AI</h1>
          <p className="lead text-muted">
            LearnMate is your intelligent document-learning assistant — built for students, educators, and lifelong learners.
          </p>
        </div>

        <div className="row g-4">
          {/* Upload & Understand */}
          <div className="col-md-6">
            <div className="card shadow h-100 card-hover-bounce">
              <div className="card-body">
                <h4 className="card-title">📄 Upload & Understand</h4>
                <p className="card-text">
                  Upload your study material, notes, or textbooks in PDF format. LearnMate will intelligently process the content
                  and get it ready for interaction.
                </p>
              </div>
            </div>
          </div>

          {/* Chat with Documents */}
          <div className="col-md-6">
            <div className="card shadow h-100 card-hover-bounce">
              <div className="card-body">
                <h4 className="card-title">💬 Chat with Documents</h4>
                <p className="card-text">
                  Have a conversation with your PDF. Ask questions, get explanations, or clarify concepts — just like chatting with a tutor.
                </p>
              </div>
            </div>
          </div>

          {/* Summarization */}
          <div className="col-md-6">
            <div className="card shadow h-100 card-hover-bounce">
              <div className="card-body">
                <h4 className="card-title">🧾 Summarization</h4>
                <p className="card-text">
                  Quickly get AI-generated summaries of long documents. Save time while reviewing or revising important topics.
                </p>
              </div>
            </div>
          </div>

          {/* Quiz Generation */}
          <div className="col-md-6">
            <div className="card shadow h-100 card-hover-bounce">
              <div className="card-body">
                <h4 className="card-title">🧠 Quiz Generation</h4>
                <p className="card-text">
                  Turn any content into personalized quizzes. Practice and test your knowledge — instantly and interactively.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-5 text-center">
          <h5 className="text-muted text-center mt-4">
            <strong>Tech Stack:</strong>&nbsp;
            <span className="badge bg-primary mx-1">React</span>
            <span className="badge bg-primary-subtle text-dark mx-1">Bootstrap</span>
            <span className="badge bg-secondary mx-1">Express.js</span>
            <span className="badge bg-info text-dark mx-1">FastAPI</span>
            <span className="badge bg-dark mx-1">Multer</span>
            <span className="badge bg-warning text-dark mx-1">Gemini Flash 1.5 (LLM)</span>
            <span className="badge bg-success mx-1">RAG</span>
            <span className="badge bg-success mx-1">SentenceTransformers</span>
            <span className="badge bg-success mx-1">FAISS</span>
            <span className="badge bg-secondary mx-1">NLTK</span>
            <span className="badge bg-secondary mx-1">LangChain</span>
            <span className="badge bg-dark mx-1">MongoDB</span>
          </h5>

          <p className="text-muted">
            Designed to bridge learning and AI — accessible, interactive, and empowering.
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
