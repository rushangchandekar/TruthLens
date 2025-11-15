# --- COPY AND PASTE THIS INTO agent.py ---
import vertexai
from vertexai.preview import reasoning_engines

# MAKE SURE THIS IS YOUR REAL ID
vertexai.init(project="truthlens-478007", location="us-central1") 

# Initialize Vertex AI (Optional: Replace with your project ID if needed, 
# but usually automatic with gcloud auth)
vertexai.init()

# Define the model
model = "gemini-1.5-pro-preview-0409"

# Define the agent
# We use 'reasoning_engines' instead of 'agent_engines' to fix the import error
agent = reasoning_engines.LangchainAgent(
    model=model,
    prompt="You are a helpful assistant that provides alternative perspectives.",
)

print("Agent loaded successfully!")