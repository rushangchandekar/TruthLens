// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface DebateResponse {
  status: string;
  query: string;
  verdict: string;
  confidence_level: string;
  synthesis_explanation: string;
  debate_rounds: number;
  agent_output: string;
  evidence: {
    official: Array<{
      title: string;
      type: string;
      snippet: string;
    }>;
    social: Array<{
      title: string;
      type: string;
      snippet: string;
    }>;
  };
}

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const investigateClaim = async (claim: string): Promise<DebateResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/debating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ claim }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(response.status, error.detail || 'Investigation failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'Network error. Please check if the backend is running on port 8000.');
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};