import { useState } from 'react';
import axios from 'axios';

function QuizTab({ token }) {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // 🔐 prevent re-submission

  const fetchQuiz = async () => {
    const session_id = localStorage.getItem('session_id');
    setLoading(true);
    setResult(null);
    setSubmitted(false); // reset submission on new quiz
    try {
      const res = await axios.post(
        'http://localhost:5000/api/files/generate-quiz',
        { session_id },
        { headers: { Authorization: token } }
      );
      setQuiz(res.data.quiz || []);
      setAnswers({});
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      setQuiz([]);
    }
    setLoading(false);
  };

  const submitQuiz = async () => {
    if (submitted) return; // already submitted

    const session_id = localStorage.getItem('session_id');

    const formattedAnswers = quiz.map((q) => ({
      question: q.question,
      selected_option: answers[q.question] || '',
    }));

    try {
      const res = await axios.post(
        'http://localhost:5000/api/files/submit-quiz',
        {
          session_id,
          answers: formattedAnswers,
        },
        {
          headers: { Authorization: token },
        }
      );
      setResult(res.data);
      setSubmitted(true); // 🔒 block further submits
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setResult({ score: 0, total: 0, details: '❌ Submission failed' });
    }
  };

  return (
    <div>
      <h3>🧠 Attempt Quiz</h3>
      <button className="btn btn-warning mb-3" onClick={fetchQuiz} disabled={loading}>
        {loading ? 'Loading quiz...' : 'Generate Quiz'}
      </button>

      {quiz.length > 0 && quiz.map((q, i) => (
        <div key={i} className="mb-4">
          <p><strong>{i + 1}. {q.question}</strong></p>
          {Object.entries(q.options).map(([optKey, optVal]) => (
            <div
              key={optKey}
              className={`form-check p-2 rounded mb-2 ${answers[q.question] === optKey ? 'bg-primary text-white' : 'bg-light border'}`}
              style={{ transition: '0.2s' }}
            >
              <input
                className="form-check-input me-2"
                type="radio"
                name={`q-${i}`}
                value={optKey}
                checked={answers[q.question] === optKey}
                onChange={() => setAnswers({ ...answers, [q.question]: optKey })}
                disabled={submitted}
                id={`q-${i}-${optKey}`}
                style={{ display: 'none' }} // Hide native radio
              />
              <label
                htmlFor={`q-${i}-${optKey}`}
                className="w-100 m-0 p-2 rounded d-block"
                style={{
                  cursor: 'pointer',
                  backgroundColor: answers[q.question] === optKey ? '#0d6efd' : '#f8f9fa',
                  color: answers[q.question] === optKey ? '#fff' : '#000',
                  border: '1px solid #ced4da',
                  transition: '0.2s ease-in-out',
                }}
              >
                ({optKey}) {optVal}
              </label>
            </div>
          ))}

        </div>
      ))}

      {quiz.length > 0 && (
        <button
          className="btn btn-success"
          onClick={submitQuiz}
          disabled={submitted}
        >
          Submit Quiz
        </button>
      )}

      {result && (
        <div className="mt-4">
          <h5>✅ Score: {result.score} / {result.total}</h5>

          {result.details && Array.isArray(result.details) && (
            <div className="mt-3">
              <h5 className="mb-3">📋 Answer Review</h5>
              {result.details.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 mb-3 rounded border ${item.is_correct ? 'border-success bg-light' : 'border-danger bg-light-subtle'}`}
                >
                  <p className="fw-bold mb-1">{index + 1}. {item.question}</p>
                  <p className="mb-1">
                    <strong>Your Answer:</strong> ({item.selected}) {quiz[index]?.options?.[item.selected] || 'N/A'}
                  </p>
                  <p className="mb-1">
                    <strong>Correct Answer:</strong> ({item.correct}) {quiz[index]?.options?.[item.correct] || 'N/A'}
                  </p>
                  <p className={`fw-semibold ${item.is_correct ? 'text-success' : 'text-danger'}`}>
                    {item.is_correct ? '✔️ Correct' : '❌ Incorrect'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizTab;
