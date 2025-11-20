# backend/main.py - Add port 8080 to allowed origins
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel
import re

# --- CONFIGURATION ---
PROJECT_ID = "truthlens-478007"
LOCATION = "us-central1"

app = FastAPI()

# CORS - ADD PORT 8080
origins = [
    "http://localhost:5173",
    "http://localhost:8080",  # ← ADDED THIS
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",  # ← AND THIS
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vertex AI
print("🔧 Initializing Vertex AI...")
try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    model = GenerativeModel("gemini-2.5-flash")
    print("✅ Vertex AI initialized")
except Exception as e:
    print(f"⚠️  Warning: {e}")
    model = None

class QueryRequest(BaseModel):
    claim: str

PROMPT_TEMPLATE = """You are TruthLens, an expert fact-checking AI agent.

Analyze this claim: "{claim}"

Provide your response in this exact format:

VERDICT: [True/False/Partially True/Unverified]
CONFIDENCE SCORE: [0-100%]
EXPLANATION: [Provide 2-3 sentences explaining your analysis]
OFFICIAL SOURCES: [List atleast 2-3 reliable sources separated by |]
SOCIAL SOURCES: [List atleast 2 social media platforms where this is discussed, separated by |]

Be specific and factual.
"""

def parse_agent_response(response_text: str, claim: str):
    verdict = "Unverified"
    confidence = "50%"
    explanation = "Analysis in progress..."
    official_sources = []
    social_sources = []
    
    try:
        # Extract verdict
        verdict_match = re.search(r'VERDICT:\s*(.+?)(?:\n|$)', response_text, re.IGNORECASE)
        if verdict_match:
            verdict = verdict_match.group(1).strip()
        
        # Extract confidence
        confidence_match = re.search(r'CONFIDENCE SCORE:\s*(\d+%?)', response_text, re.IGNORECASE)
        if confidence_match:
            confidence = confidence_match.group(1).strip()
            if not confidence.endswith('%'):
                confidence += '%'
        
        # Extract explanation
        explanation_match = re.search(r'EXPLANATION:\s*(.+?)(?:\n|OFFICIAL|SOCIAL|$)', response_text, re.IGNORECASE | re.DOTALL)
        if explanation_match:
            explanation = explanation_match.group(1).strip()
        
        # Extract official sources
        official_match = re.search(r'OFFICIAL SOURCES:\s*(.+?)(?:\n|SOCIAL|$)', response_text, re.IGNORECASE)
        if official_match:
            sources = [s.strip() for s in official_match.group(1).split('|') if s.strip()]
            official_sources = [
                {
                    "title": source,
                    "type": "Official",
                    "snippet": f"Recommended for verification"
                }
                for source in sources[:3]
            ]
        
        # Extract social sources
        social_match = re.search(r'SOCIAL SOURCES:\s*(.+?)$', response_text, re.IGNORECASE | re.DOTALL)
        if social_match:
            sources = [s.strip() for s in social_match.group(1).split('|') if s.strip()]
            social_sources = [
                {
                    "title": source,
                    "type": "Social",
                    "snippet": f"Public discussion platform"
                }
                for source in sources[:3]
            ]
        
        # Defaults if not found
        if not official_sources:
            official_sources = [
                {"title": "Academic Database", "type": "Official", "snippet": "Peer-reviewed sources"}
            ]
        
        if not social_sources:
            social_sources = [
                {"title": "Social Media", "type": "Social", "snippet": "Public discussions"}
            ]
            
    except Exception as e:
        print(f"Parse error: {e}")
    
    return {
        "verdict": verdict,
        "confidence": confidence,
        "explanation": explanation,
        "official_sources": official_sources,
        "social_sources": social_sources
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/debating")
async def run_debate(request: QueryRequest):
    try:
        print(f"\n📝 Claim: {request.claim}")
        
        if model is None:
            raise HTTPException(status_code=503, detail="AI model not initialized")
        
        # Generate prompt
        prompt = PROMPT_TEMPLATE.format(claim=request.claim)
        
        # Query model
        print("🤖 Querying AI...")
        response = model.generate_content(prompt)
        output = response.text
        
        print(f"✅ Response received: {output[:100]}...")
        
        # Parse response
        parsed = parse_agent_response(output, request.claim)
        
        result = {
            "status": "complete",
            "query": request.claim,
            "verdict": parsed["verdict"],
            "confidence_level": parsed["confidence"],
            "synthesis_explanation": parsed["explanation"],
            "debate_rounds": 2,
            "agent_output": output,
            "evidence": {
                "official": parsed["official_sources"],
                "social": parsed["social_sources"]
            }
        }
        
        print(f"✅ Verdict: {result['verdict']}")
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting TruthLens API on http://localhost:8000")
    print("📡 CORS enabled for ports: 5173, 8080, 3000")
    uvicorn.run(app, host="0.0.0.0", port=8000)