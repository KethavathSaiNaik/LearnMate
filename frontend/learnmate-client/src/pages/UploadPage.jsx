import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../context/AuthContext.jsx';

import SummarizeTab from '../components/SummarizeTab.jsx';
import ChatTab from '../components/ChatTab.jsx';
import QuizTab from '../components/QuizTab.jsx';
import History from '../components/History';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [summary, setSummary] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.user?.id && !localStorage.getItem('session_id')) {
      const newSessionId = uuidv4();
      localStorage.setItem('session_id', newSessionId);
    }
  }, [user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
    setFileUploaded(false);
    setSummary('');
    setChatHistory([]);
  };

  const handleUpload = async () => {
    const session_id = localStorage.getItem('session_id');
    const token = user?.token;

    if (!user?.user?.id || !session_id || !token) {
      setStatus('❌ You must be logged in to upload.');
      return;
    }

    if (!file) {
      setStatus('❗ Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', session_id);

    try {
      setStatus('⏳ Uploading...');
      await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      });
      setStatus('✅ File uploaded successfully!');
      setFileUploaded(true);
    } catch (error) {
      console.error('Upload failed:', error?.response?.data || error.message);
      setStatus('❌ Upload failed. Try again.');
    }
  };

  const renderContent = () => {
    if (activeTab === 'upload') {
      return (
        <div className="p-4 shadow-sm rounded-4 bg-white border">
          <h3 className="mb-4 fw-bold text-primary text-center">📄 Upload Your PDF</h3>

          <div className="mb-4">
            <label htmlFor="pdf-upload" className="form-label fw-semibold">Select a PDF File</label>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>

          <div className="d-grid gap-2">
            <button className="btn btn-primary btn-lg" onClick={handleUpload}>
              🚀 Upload PDF
            </button>
          </div>

          {status && (
            <div className="alert alert-info mt-4" role="alert">
              <strong>Status:</strong> {status}
            </div>
          )}
        </div>
      );
    }


    if (!fileUploaded && activeTab !== 'history') {
      return <div
        className="text-center"
        style={{
          minHeight: '60vh', // or '100vh' if full-page
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/no-file-uploaded.png"
          alt="Please upload a file"
          style={{
            width: '180px',
            height: '180px',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
          className="mb-3 shadow-sm"
        />

        <p className="text-muted fs-5">🚫 Please upload a file first.</p>
      </div>

    }

    switch (activeTab) {
      case 'summarize':
        return <SummarizeTab token={user?.token} summary={summary} setSummary={setSummary} />;
      case 'chat':
        return <ChatTab token={user?.token} chat={chatHistory} setChat={setChatHistory} />;
      case 'quiz':
        return <QuizTab token={user?.token} />;
      case 'history':
        return <History token={user?.token} />;
      default:
        return null;
    }
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {/* Sidebar */}
      <div className="bg-light p-3" style={{ width: '240px' }}>
        <ul className="nav flex-column">
          {['upload', 'summarize', 'chat', 'quiz', 'history'].map((tab) => (
            <li className="nav-item mb-2" key={tab}>
              <button
                className={`btn w-100 text-start ${activeTab === tab ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab(tab)}
              >
                {{
                  upload: '📤 Upload',
                  summarize: '🧾 Summarize',
                  chat: '💬 Chat',
                  quiz: '🧠 Attempt Quiz',
                  history: '📊 Your Summaries'
                }[tab]}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default UploadPage;
