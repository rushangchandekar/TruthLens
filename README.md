# 🛡️ TruthLens: The Multi-Agent Fact-Checking System

**TruthLens** is a next-generation, AI-powered system designed to verify claims and fight misinformation. It is not a single AI model but a multi-agent system that orchestrates a "debate" between specialized agents to provide nuanced, evidence-grounded answers.

## 🚀 The Problem
In an era of rampant misinformation, AI hallucinations, and viral social media narratives, it's incredibly difficult to separate fact from perception. Traditional fact-checkers are often too slow, and individual AI models can "hallucinate" or provide binary answers that miss crucial context.

## ✨ Our Solution
TruthLens solves this by:
1.  **Grounding Everything in Evidence:** All agent outputs *must* be grounded in retrieved evidence.
2.  **Debating Nuance:** Agents "debate" under strict rules. If evidence is insufficient, the system admits uncertainty.
3.  **Providing Context:** We don't just give a "True/False" verdict. We provide **Partially True**, **Unverified**, or **Inconclusive** ratings, complete with confidence scores and full explanations.

## 的核心 Features (Core Features)

* **Dual-Stream Analysis:** Simultaneously analyzes **Official Evidence** (research papers, govt docs) and **Viral Perception** (social posts, reels).
* **Hallucination-Proof by Design:** A strict **"Cite-or-Discard"** policy and a `Critic` agent reject any claim that is not backed by a retrieved citation.
* **Loop-Safe Debates:** A `Moderator` agent controls the debate flow, capping iterations (max 3 rounds) to prevent infinite loops and ensure a fast verdict.
* **Full Transparency:** The final output is fully transparent, showing the verdict, confidence level, a human-readable explanation, and all sources used.

## ⚙️ How It Works: The Agentic Architecture

TruthLens uses a team of specialized agents to find the truth:

1.  **`Fact-Finder`**: Collects hard evidence from trusted sources like government docs and research papers.
2.  **`Pattern Detector`**: Scrapes viral content (reels, social posts) to identify repeated public narratives.
3.  **`Verifier`**: Cross-checks claims and marks them as **Supported**, **Refuted**, or **Unverified**.
4.  **`Counterpoint`**: Looks for missing context or alternative perspectives (e.g., "This is true, *but*...").
5.  **`Critic`**: Acts as an internal police, rejecting hallucinations and ensuring all reasoning is based purely on cited evidence.
6.  **`Moderator`**: Controls the debate, enforces a 3-round max, and calls the final verdict if the debate is deadlocked.
7.  **`Explainer`**: Synthesizes all findings into the final, human-readable summary for the user.

## 🛠️ Tech Stack

This project is built using a modern, scalable stack as defined in the system blueprint:

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React + Tailwind CSS  | User interface and results dashboard |
| **Backend** | FastAPI  | API for agent orchestration |
| **Agent Orchestration** | Vertex AI Agent Builder / LangChain  | Managing the multi-agent debate logic |
| **LLMs** | Gemini / GPT / LLAMA | Reasoning engine for agents |
| **Database** | Pinecone / Weaviate | Vector DB for knowledge retrieval |
| **Data Retrieval** | Govt APIs, News APIs, Social Scraping | Populating the knowledge base |

## 🚀 Getting Started (Frontend)

To run the frontend demonstration client:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[your-repo]/truthlens.git
    ```

2.  **Navigate to the frontend directory:**
    ```bash
    cd truthlens/frontend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run start
    ```
    The application will be available at `http://localhost:3000`.

## 🕹️ How to Use

1.  Open the TruthLens dashboard.
2.  Enter a claim you want to verify (e.g., *"E20 damages your engine"* ).
3.  Press "Investigate" and watch as the agents (Fact-Finder, Verifier, etc.) activate in real-time.
4.  After the debate (max 3 rounds), review the final verdict, confidence score, and the synthesized explanation.
5.  Check the "Official Evidence" and "Social Perception" columns to see the sources that informed the AI's conclusion.
