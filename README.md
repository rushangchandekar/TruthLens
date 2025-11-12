# 🛡️ TruthLens: The Multi-Agent Fact-Checking System

**TruthLens** is a next-generation, AI-powered system designed to verify claims and fight misinformation. [cite_start]It is not a single AI model but a multi-agent system [cite: 3] that orchestrates a "debate" between specialized agents to provide nuanced, evidence-grounded answers.

## 🚀 The Problem
In an era of rampant misinformation, AI hallucinations, and viral social media narratives, it's incredibly difficult to separate fact from perception. Traditional fact-checkers are often too slow, and individual AI models can "hallucinate" or provide binary answers that miss crucial context.

## ✨ Our Solution
TruthLens solves this by:
1.  [cite_start]**Grounding Everything in Evidence:** All agent outputs *must* be grounded in retrieved evidence[cite: 4].
2.  [cite_start]**Debating Nuance:** Agents "debate" under strict rules[cite: 5]. [cite_start]If evidence is insufficient, the system admits uncertainty[cite: 5].
3.  **Providing Context:** We don't just give a "True/False" verdict. [cite_start]We provide **Partially True**, **Unverified**, or **Inconclusive** ratings [cite: 55][cite_start], complete with confidence scores [cite: 57] [cite_start]and full explanations[cite: 56].

## 的核心 Features (Core Features)

* [cite_start]**Dual-Stream Analysis:** Simultaneously analyzes **Official Evidence** (research papers, govt docs) [cite: 21] [cite_start]and **Viral Perception** (social posts, reels)[cite: 25, 98].
* [cite_start]**Hallucination-Proof by Design:** A strict **"Cite-or-Discard"** policy [cite: 60] [cite_start]and a `Critic` agent [cite: 41] reject any claim that is not backed by a retrieved citation.
* [cite_start]**Loop-Safe Debates:** A `Moderator` agent controls the debate flow, capping iterations (max 3 rounds) [cite: 46, 66] [cite_start]to prevent infinite loops and ensure a fast verdict[cite: 100].
* [cite_start]**Full Transparency:** The final output is fully transparent, showing the verdict, confidence level, a human-readable explanation, and all sources used [cite: 54-58, 102].

## ⚙️ How It Works: The Agentic Architecture

[cite_start]TruthLens uses a team of specialized agents to find the truth[cite: 7]:

1.  [cite_start]**`Fact-Finder`**: Collects hard evidence from trusted sources like government docs and research papers[cite: 21].
2.  [cite_start]**`Pattern Detector`**: Scrapes viral content (reels, social posts) to identify repeated public narratives[cite: 25, 26].
3.  [cite_start]**`Verifier`**: Cross-checks claims and marks them as **Supported**, **Refuted**, or **Unverified**[cite: 31].
4.  [cite_start]**`Counterpoint`**: Looks for missing context or alternative perspectives (e.g., "This is true, *but*...")[cite: 35, 36].
5.  [cite_start]**`Critic`**: Acts as an internal police, rejecting hallucinations and ensuring all reasoning is based purely on cited evidence[cite: 39, 41].
6.  [cite_start]**`Moderator`**: Controls the debate, enforces a 3-round max, and calls the final verdict if the debate is deadlocked[cite: 45, 66, 70].
7.  [cite_start]**`Explainer`**: Synthesizes all findings into the final, human-readable summary for the user[cite: 52].

## 🛠️ Tech Stack

This project is built using a modern, scalable stack as defined in the system blueprint:

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | [cite_start]React + Tailwind CSS [cite: 91] | User interface and results dashboard |
| **Backend** | [cite_start]FastAPI [cite: 92] | API for agent orchestration |
| **Agent Orchestration** | [cite_start]Vertex AI Agent Builder / LangChain [cite: 86] | Managing the multi-agent debate logic |
| **LLMs** | [cite_start]Gemini / GPT / LLAMA [cite: 87] | Reasoning engine for agents |
| **Database** | [cite_start]Pinecone / Weaviate [cite: 90] | [cite_start]Vector DB for knowledge retrieval [cite: 22] |
| **Data Retrieval** | [cite_start]Govt APIs, News APIs, Social Scraping [cite: 89] | Populating the knowledge base |

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
2.  [cite_start]Enter a claim you want to verify (e.g., *"E20 damages your engine"* [cite: 71]).
3.  Press "Investigate" and watch as the agents (Fact-Finder, Verifier, etc.) activate in real-time.
4.  After the debate (max 3 rounds), review the final verdict, confidence score, and the synthesized explanation.
5.  Check the "Official Evidence" and "Social Perception" columns to see the sources that informed the AI's conclusion.
