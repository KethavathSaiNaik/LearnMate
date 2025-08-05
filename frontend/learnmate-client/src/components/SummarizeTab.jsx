import { useState } from 'react';
import axios from 'axios';

function SummarizeTab({ token, summary, setSummary }) {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const handleSummarize = async () => {
    const session_id = localStorage.getItem('session_id');
    setLoading(true);
    setSaveStatus('');
    setShowSaveInput(false);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/files/summarize',
        { session_id },
        { headers: { Authorization: token } }
      );

      const generatedSummary = res.data.summary || res.data;
      setSummary(generatedSummary);
      setShowSaveInput(true);
    } catch (err) {
      console.error(err);
      setSummary('❌ Failed to summarize document.');
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!documentName.trim()) {
      setSaveStatus('❗ Please enter a document name.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/summary/save',
        {
          summary_text: summary,
          document_name: documentName.trim(),
        },
        { headers: { Authorization: token } }
      );
      setSaveStatus('✅ Summary saved successfully.');
      setShowSaveInput(false);
    } catch (err) {
      console.error(err);
      setSaveStatus('❌ Failed to save summary.');
    }
  };

  return (
    <div className="container my-3">
      <h3>🧾 Summarize Document</h3>

      <button
        className="btn btn-info mb-3 me-2"
        onClick={handleSummarize}
        disabled={loading}
      >
        {loading ? 'Summarizing...' : summary ? 'Summarize Again' : 'Summarize Now'}
      </button>

      {summary && showSaveInput && (
        <div className="mb-3">
          <label className="form-label fw-semibold">📄 Save as:</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter document name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleSave}>
            💾 Save Summary
          </button>
        </div>
      )}

      {saveStatus && <p className="text-muted mt-2">{saveStatus}</p>}

      {summary && (
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-header bg-info text-white fw-bold">
            📌 Summarized Notes
          </div>
          <div className="card-body">{renderCleanSummary(summary)}</div>
        </div>
      )}
    </div>
  );
}

// ⬇️ Renders structured summary text with formatting
function renderCleanSummary(text) {
  const sections = text.split(/\n(?=\d+\.\s)/);

  return sections.map((section, idx) => {
    const lines = section.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return null;

    const headingLine = lines[0];
    const title = headingLine.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim();

    let summary = '';
    const keyIdeas = [];

    for (let line of lines.slice(1)) {
      if (/^\*?\s*\*\*Key Ideas:\*\*/i.test(line.trim())) continue;

      const match = line.match(/^\*?\s*\**([\w\s\-\/]+?)\**\s*:\s*(.+)/);
      if (match) {
        const term = match[1].trim().replace(/\*\*/g, '');
        const desc = match[2].trim().replace(/\*\*/g, '');
        if (/^summary$/i.test(term)) {
          summary = desc;
        } else {
          keyIdeas.push(`<strong>${term}:</strong> ${desc}`);
        }
      } else if (line.trim().startsWith('*')) {
        const raw = line.replace(/^\*\s*/, '').replace(/\*\*/g, '').trim();
        keyIdeas.push(raw);
      }
    }

    return (
      <div key={idx} className="mb-4">
        <h5 className="fw-bold">{idx + 1}. {title}</h5>
        {summary && <p><strong>Summary:</strong> {summary}</p>}
        {keyIdeas.length > 0 && (
          <div>
            <p className="mb-1 fw-semibold">Key Ideas:</p>
            <ul className="ms-4">
              {keyIdeas.map((idea, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: idea }} />
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  });
}

export default SummarizeTab;
