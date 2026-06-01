# 🛡️ TruthLens: The Multi-Agent Fact-Checking System

**TruthLens** is an AI-powered system designed to verify claims and fight misinformation. It is not a single AI model but a visual multi-agent workflow orchestrated in **n8n** that runs fact-checking logic to provide nuanced, evidence-grounded answers.

---

## 📂 Project Structure

The repository is organized into a clean multi-tier structure:

*   **`backend/`**: A lightweight Python FastAPI backend that proxies frontend requests to the n8n agent.
*   **`frontend/`**: A modern React + Tailwind CSS client dashboard powered by Vite.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) + Tailwind CSS | Interactive user interface & results dashboard |
| **Backend** | FastAPI (Python) | API gateway & proxy for agent orchestration |
| **Agent Orchestration** | **n8n Workflow** | Managing the multi-agent debate logic and tool execution |
| **LLMs** | Google Gemini (via AI Studio free tier) | Reasoning engine for fact-checking agents |

---

## ⚙️ Getting Started

### 1. n8n AI Agent Setup
1.  Start n8n on your local machine:
    ```bash
    npx n8n
    ```
2.  Open your browser to `http://localhost:5678` and create a new workflow.
3.  Import the n8n JSON canvas file from your project artifacts.
4.  Get a free Gemini API Key from [Google AI Studio](https://aistudio.google.com/).
5.  Link your API Key inside the **Call Gemini API** node, and toggle the workflow to **Active** (in the top-right corner).

### 2. Backend Setup
1.  Navigate to the `backend/` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the FastAPI server:
    ```bash
    python main.py
    ```
    The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
1.  Navigate to the `frontend/` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the Vite development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## 🕹️ How to Use

1.  Open the TruthLens dashboard at `http://localhost:5173`.
2.  Enter a claim you want to verify (e.g., *"E20 fuel damages car engines"*).
3.  Press "Investigate" and watch the API route the query to your visual n8n dashboard.
4.  Review the final verdict (e.g., **Verified**, **False**, or **Unverified**), confidence score, synthesized explanation, and sourced references.
