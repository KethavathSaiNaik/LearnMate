import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function ChatTab({ token, chat, setChat }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const session_id = localStorage.getItem('session_id');
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/files/chat',
        { session_id, query },
        { headers: { Authorization: token } }
      );
      setChat((prev) => [...prev, { query, response: res.data.answer || res.data }]);
      setQuery('');
    } catch {
      setChat((prev) => [...prev, { query, response: '❌ Chat failed.' }]);
    }
    setLoading(false);

    // Scroll to bottom after sending
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Scroll to latest on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div
      className="d-flex flex-column"
      style={{
        width: '75vw',
        height: '100vh',
        background: '#f8f9fa',
        fontSize: '1.1rem',
        borderLeft: '1px solid #ddd',
      }}
    >
      {/* Scrollable Chat Area */}
      <div
        className="flex-grow-1 overflow-auto px-3"
        style={{ paddingBottom: '100px' }}
      >
        {chat.map((item, idx) => (
          <div key={idx} className="mb-4">
            {/* You */}
            <div className="d-flex justify-content-end">
              <div
                className="px-4 py-2 rounded-4 text-white"
                style={{
                  backgroundColor: '#0d6efd',
                  maxWidth: '75%',
                  fontSize: '1.05rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <strong>You:</strong> {item.query}
              </div>
            </div>

            {/* AI */}
            <div className="d-flex justify-content-start mt-2">
              <div
                className="px-4 py-2 rounded-4 bg-white border"
                style={{
                  maxWidth: '75%',
                  fontSize: '1.05rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                }}
              >
                <strong>AI:</strong> {item.response}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Sticky Input Area */}
      <div
        className="px-3 py-3 border-top bg-white"
        style={{
          position: 'sticky',
          bottom: '0',
          zIndex: 10,
        }}
      >
        <div className="d-flex">
          <input
            className="form-control me-3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something from the document..."
            style={{ fontSize: '1.1rem' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            className="btn btn-success px-4"
            onClick={sendMessage}
            disabled={loading || !query.trim()}
            style={{ fontSize: '1.05rem' }}
          >
            {loading ? 'Asking...' : 'Ask Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatTab;
