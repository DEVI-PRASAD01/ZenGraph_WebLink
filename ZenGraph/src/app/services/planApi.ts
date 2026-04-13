// src/app/services/planApi.ts
import { api } from "./config";
import type { AIPlan } from "./sessionApi";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const planApi = {
  // Methods requested by user
  getUserPlan: async (token: string) => {
    const res = await fetch(`${BASE_URL}/api/plan`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch plan");
    return res.json();
  },

  updatePlan: async (token: string, data: object) => {
    const res = await fetch(`${BASE_URL}/api/plan`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update plan");
    return res.json();
  },

  // Existing methods required for the app to function
  get(userId: number): Promise<AIPlan[]> {
    return api.get(`/plan/${userId}`);
  },
  
  generate(data: {
    user_id: number;
    goal: string;
    mood: string;
    level: string;
  }): Promise<AIPlan> {
    return api.post("/ai/generate-plan", data);
  },
};
