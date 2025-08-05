from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv
from typing import Dict, List
from pydantic import BaseModel
import os
import json
import shutil
import tempfile

# Load env
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.2,
    max_output_tokens=1024
)

# Stores per session
session_memory_store: Dict[str, ConversationBufferMemory] = {}
session_vector_store: Dict[str, FAISS] = {}

os.makedirs("quiz_store", exist_ok=True)

# ==== Upload PDF ==== #
@app.post("/upload/")
async def upload_file(session_id: str = Form(...), file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_file.write(await file.read())
            tmp_path = tmp_file.name

        loader = PyPDFLoader(tmp_path)
        documents = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        docs = splitter.split_documents(documents)
        db = FAISS.from_documents(docs, embeddings)

        session_vector_store[session_id] = db
        os.remove(tmp_path)

        return {"message": "✅ File uploaded and indexed successfully."}
    except Exception as e:
        return {"error": f"❌ Failed to process file: {str(e)}"}

# ==== Chat ==== #
@app.post("/chat/")
async def chat_with_memory(session_id: str = Form(...), query: str = Form(...)):
    try:
        if session_id not in session_vector_store:
            return {"error": "❌ No documents indexed for this session."}

        if session_id not in session_memory_store:
            session_memory_store[session_id] = ConversationBufferMemory(
                memory_key="chat_history", return_messages=True
            )

        memory = session_memory_store[session_id]
        db = session_vector_store[session_id]

        conversation_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=db.as_retriever(),
            memory=memory,
            return_source_documents=False
        )

        result = conversation_chain.invoke({"question": query})
        return {
            "answer": result["answer"],
            "chat_history": [
                {"role": msg.type, "content": msg.content}
                for msg in memory.chat_memory.messages
            ]
        }
    except Exception as e:
        return {"error": f"❌ Failed to chat: {str(e)}"}

# ==== Reset Session ==== #
@app.post("/reset_memory/")
async def reset_memory(session_id: str = Form(...)):
    session_memory_store.pop(session_id, None)
    session_vector_store.pop(session_id, None)
    quiz_path = os.path.join("quiz_store", f"{session_id}.json")
    if os.path.exists(quiz_path):
        os.remove(quiz_path)
    return {"message": f"✅ Session {session_id} reset."}

# ==== Summarize ==== #
@app.post("/summarize/")
async def summarize_doc(session_id: str = Form(...)):
    try:
        if session_id not in session_vector_store:
            return {"error": "❌ No documents for this session."}

        db = session_vector_store[session_id]
        docs = db.similarity_search("Summarize this document", k=10)
        context = " ".join([doc.page_content for doc in docs])

        prompt = PromptTemplate(
            input_variables=["context"],
            template="""Summarize the entire content below without omitting any important information. Organize the response clearly into numbered sections.

For each section:
- Start with the section **title** as a heading.
- Provide a **Summary** paragraph explaining the concept.
- Follow with a **Key Ideas** bullet list, where each bullet starts with a **bold** keyword followed by its explanation.

Avoid nested bullets or redundant "Key Ideas" labels inside the list.

Content:
{context}

Complete Summary:
"""
        )
        chain = prompt | llm
        summary = chain.invoke({"context": context})
        return {"summary": summary.content}
    except Exception as e:
        return {"error": f"❌ Failed to summarize: {str(e)}"}

# ==== Quiz Gen ==== #
@app.post("/generate_quiz/")
async def generate_quiz(session_id: str = Form(...)):
    try:
        if session_id not in session_vector_store:
            return {"error": "❌ No documents for this session."}

        db = session_vector_store[session_id]
        docs = db.similarity_search("Generate quiz from document", k=10)
        context = " ".join([doc.page_content for doc in docs])

        prompt = PromptTemplate(
            input_variables=["context"],
            template="""
You are a quiz generator. Based on the following content, generate exactly 5 multiple choice questions (MCQs) in **valid JSON** format.

⚠️ IMPORTANT:
- DO NOT use markdown (no ```json)
- DO NOT include explanations
- Just return raw valid JSON

Return only in this format:

[
  {{
    "question": "Your question?",
    "options": {{
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    }},
    "answer": "A"
  }},
  ...
]

CONTENT:
{context}
""" )
        chain = prompt | llm
        raw_output = chain.invoke({"context": context}).content.strip()

        try:
            parsed_quiz = json.loads(raw_output)
        except json.JSONDecodeError as e:
            return {"error": f"❌ Failed to parse quiz JSON: {str(e)}", "raw_output": raw_output[:1000]}

        with open(f"quiz_store/{session_id}.json", "w") as f:
            json.dump(parsed_quiz, f)

        return {"quiz": parsed_quiz}
    except Exception as e:
        return {"error": f"❌ Failed to generate quiz: {str(e)}"}

# ==== Submit Quiz ==== #
class UserAnswer(BaseModel):
    question: str
    selected_option: str

class QuizSubmission(BaseModel):
    session_id: str
    answers: List[UserAnswer]

# @app.post("/submit_quiz/")
# async def submit_quiz(submission: QuizSubmission):
#     try:
#         path = f"quiz_store/{submission.session_id}.json"
#         if not os.path.exists(path):
#             return {"error": "❌ Quiz not found for this session."}

#         with open(path, "r") as f:
#             correct_quiz = json.load(f)

#         correct_map = {q["question"]: q["answer"] for q in correct_quiz}

#         score = 0
#         total = len(submission.answers)
#         detailed_results = []

#         for ans in submission.answers:
#             correct_option = correct_map.get(ans.question)
#             is_correct = (ans.selected_option == correct_option)
#             detailed_results.append({
#                 "question": ans.question,
#                 "selected": ans.selected_option,
#                 "correct": correct_option,
#                 "is_correct": is_correct
#             })
#             if is_correct:
#                 score += 1

#         return {
#             "score": score,
#             "total": total,
#             "details": detailed_results
#         }
#     except Exception as e:
#         return {"error": f"❌ Failed to evaluate quiz: {str(e)}"}
@app.post("/submit_quiz/")
async def submit_quiz(submission: QuizSubmission):
    try:
        path = f"quiz_store/{submission.session_id}.json"
        if not os.path.exists(path):
            return {"error": "❌ Quiz not found for this session."}

        with open(path, "r") as f:
            correct_quiz = json.load(f)

        correct_map = {q["question"]: q["answer"] for q in correct_quiz}

        score = 0
        total = len(submission.answers)
        detailed_results = []

        for ans in submission.answers:
            correct_option = correct_map.get(ans.question)
            is_correct = (ans.selected_option == correct_option)
            detailed_results.append({
                "question": ans.question,
                "selected": ans.selected_option,
                "correct": correct_option,
                "is_correct": is_correct
            })
            if is_correct:
                score += 1

        # ✅ Delete the file after evaluation
        os.remove(path)

        return {
            "score": score,
            "total": total,
            "details": detailed_results
        }

    except Exception as e:
        return {"error": f"❌ Failed to evaluate quiz: {str(e)}"}