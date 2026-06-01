import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

# Load env variables from .env
load_dotenv()

# Configuration - Default local n8n webhook URL
N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "http://localhost:5678/webhook/truthlens-factcheck")

app = FastAPI()

# CORS Configuration - allow ports for React app
origins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    claim: str

@app.get("/health")
def health_check():
    return {"status": "healthy", "provider": "n8n"}

@app.post("/api/debating")
async def run_debate(request: QueryRequest):
    print(f"\n📝 Claim received: {request.claim}")
    print(f"📡 Forwarding to n8n Webhook: {N8N_WEBHOOK_URL}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                N8N_WEBHOOK_URL,
                json={"claim": request.claim},
                timeout=60.0  # Generous timeout for AI agent processing
            )
            
            if response.status_code != 200:
                print(f"❌ n8n returned error status: {response.status_code}")
                print(f"📄 Response body: {response.text}")
                raise HTTPException(
                    status_code=502, 
                    detail=f"n8n workflow error (Status {response.status_code})"
                )
            
            try:
                result = response.json()
            except ValueError as e:
                print(f"❌ Failed to decode JSON from n8n. Raw response:\n{response.text}")
                raise HTTPException(
                    status_code=502, 
                    detail=f"n8n returned a non-JSON response. Raw text: {response.text[:200]}"
                )
            
            # If n8n returns a list/array of items (n8n's default format), extract the first item
            if isinstance(result, list):
                if len(result) > 0:
                    result = result[0]
                else:
                    raise HTTPException(
                        status_code=502, 
                        detail="n8n workflow returned an empty list"
                    )
            
            print(f"✅ Success! Verdict: {result.get('verdict')}")
            return result
            
    except httpx.RequestError as e:
        print(f"❌ Failed to connect to n8n: {e}")
        raise HTTPException(
            status_code=503, 
            detail="Could not reach n8n workflow server. Please ensure n8n is running."
        )
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting TruthLens API on http://localhost:8000")
    print(f"📡 Routing agent requests to n8n: {N8N_WEBHOOK_URL}")
    uvicorn.run(app, host="0.0.0.0", port=8000)