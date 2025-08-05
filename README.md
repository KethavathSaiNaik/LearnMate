# LearnMate-AI

LearnMate-AI is a personalized, AI-powered document learning assistant that helps you upload PDFs, receive instant AI-generated summaries, chat with your documents, generate quizzes, and evaluate your understanding — all within a single seamless platform.

---

### 🛠️ Tech Stack & Role in the System

Below is a breakdown of the technologies used in LearnMate-AI and how each one contributes to the overall workflow:

- **React** – Frontend framework for building the interactive user interface.
- **Bootstrap** – For styling and responsive UI components.
- **Express.js** – Handles authentication, session management, user profiles, and backend REST APIs.
- **FastAPI** – Powers AI-related endpoints like summarization, chatting, and quiz generation with high performance.
- **Multer** – Middleware for handling file uploads (PDFs).

- **RAG (Retrieval-Augmented Generation)** – Enhances the LLM by grounding responses using the uploaded document content.
- **SentenceTransformers** – Converts text into embeddings for semantic search.
- **FAISS** – Vector store used for storing and retrieving document chunks via similarity search.
- **NLTK** – Used for natural language processing tasks like sentence tokenization during preprocessing.
- **LangChain** – Framework to build the RAG pipeline and manage LLM interactions.
- **Gemini Flash 1.5 (LLM)** – Google’s LLM used to generate smart summaries, answer questions, and create contextual quizzes.
- **MongoDB** – Stores user data, quiz history, and summaries.

> 🧠 Together, these tools enable a seamless AI-powered learning experience — from document ingestion to interactive learning and evaluation.


### Installation

Clone the Repository

```bash
  git clone https://github.com/KethavathSaiNaik/LearnMate.git
  cd LearnMate
```

---

### Frontend Setup (React)

```bash
  cd .\frontend\Learnmate-client\
  npm install
  npm run dev
```

This will start the Vite development server on `http://localhost:5173` by default.

---

### Backend Setup (Express + MongoDB)

```bash
  cd gateway
  npm install
  nodemon server.js
```

Create a `.env` file in the `server` folder with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

### AI Engine Setup (FastAPI)

```bash
  cd backend
  python -m venv myvenv
  venv\Scripts\activate  # or source venv/bin/activate for macOS/Linux
  pip install -r requirements.txt
  uvicorn main:app --reload
```

Create a `.env` file in the `backend` folder with:

```
GOOGLE_API_KEY=your_api_key
```

---
Once all services are running:

🧠 Upload a PDF document  
✨ View AI-generated summary  
💬 Chat with the document content  
❓ Generate and attempt quizzes  
📊 Check your quiz performance history  

---



> 📚 **Learn smarter, not harder — all in one place.**


Feel free to connect, contribute, or share feedback!

