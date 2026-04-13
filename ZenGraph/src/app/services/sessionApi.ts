import { api } from "./config";

export interface RecommendPlanResponse {
    meditation_type: string;
    session_name: string;
    duration: number;
    technique: string;
    guidance_style: string;
    message: string;
    match_score: number;
}

export interface AIPlan {
    plan_id: number;
    user_id: number;
    goal: string;
    mood: string;
    level: string;
    recommended_title: string;
    duration: number;
    match_percent: number;
}

export interface SessionRecord {
    status: string;
    session_id: number;
    session: {
        id: number;
        session_name: string;
        duration_minutes: number;
        mood_before: string;
        experience_level: string;
    };
}

export interface UserStats {
    daily_streak: number;
    level: number;
    weekly_hours: number;
}

export interface LibrarySession {
    id: number;
    title: string;
    duration: number;
    category: string;
    level: string;
    technique: string;
    description: string;
}

export interface SessionAnalysis {
    session_id: number;
    stress_reduction: string;
    calm_score: number;
    focus_improvement: string;
    consistency_score: number;
    ai_insight: string;
}

export type Period = "day" | "week" | "month";

export interface ProgressData {
    period: Period;
    calm_score: number;
    mindful_minutes: number;
    stress_reduced: number;
}

export interface EmotionPoint {
    date: string;
    score: number;
}

export interface HistoryItem {
    id: number;
    session_name: string;
    goal: string;
    mood_before: string;
    mood_after: string;
    duration_minutes: number;
    experience_level: string;
    status: string;
    started_at: string;
    completed_at: string | null;
}

export type CompletionMap = Record<string, number>;

export interface ProfileData {
    id: number;
    name: string;
    email: string;
    profile_image: string | null;

    // ✅ FIX ADDED HERE (ONLY CHANGE)
    total_sessions?: number;
    total_minutes?: number;
    current_streak?: number;

    enable_notifications: boolean;
    data_sharing_consent: boolean;
}

export interface UpdatePreferencesData {
    enable_notifications: boolean;
    data_sharing_consent: boolean;
}

export interface SignupPayload {
    name: string;
    email: string;
    phone_number: string;
    password: string;
    confirm_password: string;
    enable_notifications: boolean;
}

export interface SignupResponse {
    status: string;
    message: string;
}

export interface LoginPayload {
    email?: string;
    phone_number?: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    message: string;
    user_id: number;
    name: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface VerifyOTPPayload {
    email: string;
    otp: string;
}

export interface ResetPasswordPayload {
    email: string;
    new_password: string;
}

export interface EmotionRequest {
    user_id: number;
    mood: string;
    thought?: string;
}

export interface CompleteSessionRequest {
    mood_after: string;
    actual_duration?: number;
    notes?: string;
}

export interface StartSessionRequest {
    user_id: number;
    goal: string;
    mood_before: string;
    experience_level: string;
    session_name: string;
    duration: number;
    techniques: string;
    match_score: number;
}

export interface EmotionResponse {
    status: string;
    message: string;
    predicted_emotion: string;
    confidence: number;
}

export interface RecommendPlanRequest {
    user_id: number;
    goal_type: string;
    experience_level: string;
    predicted_emotion: string;
}

export interface DashboardData {
    total_sessions: number;
    total_hours: number;
    level: number;
    graph_data: number[];
    profile_completed: boolean;
}

// --- APIs ---

export const authApi = {
    signup: (payload: SignupPayload): Promise<SignupResponse> =>
        api.post("/auth/signup", payload),

    login: (payload: LoginPayload): Promise<LoginResponse> =>
        api.post("/auth/login", payload),

    forgotPassword: (payload: ForgotPasswordPayload) =>
        api.post("/auth/forgot-password", payload),

    verifyOTP: (payload: VerifyOTPPayload) =>
        api.post("/auth/verify-otp", payload),

    resetPassword: (payload: ResetPasswordPayload) =>
        api.post("/auth/reset-password", payload),

    getDashboard: (userId: number): Promise<DashboardData> =>
        api.get(`/auth/dashboard/${userId}`),

    saveGoal: (data: { user_id: number; goal_type: string; experience: string }) =>
        api.post("/auth/save-goal", data),

    getGoal: (userId: number) =>
        api.get(`/auth/get-goal/${userId}`),
};

export const recommendationApi = {
    generate(data: RecommendPlanRequest): Promise<RecommendPlanResponse> {
        return api.post("/ai/recommend-plan", data);
    },
};

export const sessionApi = {
    selectGoal(userId: number, goalType: string) {
        return api.post("/auth/select-goal", {
            user_id: userId,
            goal_type: goalType,
        });
    },

    checkin(userId: number, moodScore: number) {
        return api.post("/auth/checkin", {
            user_id: userId,
            mood_score: moodScore,
        });
    },

    start(data: StartSessionRequest): Promise<SessionRecord> {
        return api.post("/session/start", data);
    },

    complete(sessionId: number, data: CompleteSessionRequest) {
        return api.post(`/session/complete/${sessionId}`, data);
    },

    pause(sessionId: number) {
        return api.post(`/session/pause/${sessionId}`, {});
    },

    resume(sessionId: number) {
        return api.post(`/session/resume/${sessionId}`, {});
    },

    history(userId: number): Promise<{ status: string; sessions: HistoryItem[] }> {
        return api.get(`/session/history/${userId}`);
    },

    stats(userId: number): Promise<UserStats> {
        return api.get(`/session/stats/${userId}`);
    },
};

export const checkInApi = {
    submit(data: {
        user_id: number;
        session_id?: number;
        mood_after: string;
        notes?: string;
    }) {
        return api.post("/session/checkin", data);
    },
};

export const libraryApi = {
    all(): Promise<LibrarySession[]> {
        return api.get("/library/sessions");
    },

    byCategory(category: string): Promise<LibrarySession[]> {
        return api.get(`/library/sessions/${category}`);
    },
};

export const libraryPlanApi = {
    generate(data: {
        user_id: number;
        title: string;
        duration: number;
        category: string;
    }): Promise<{ plan_id: number }> {
        return api.post("/library/generate-plan", data);
    },
};

export const emotionApi = {
    log(data: {
        user_id: number;
        emotion: string;
        note?: string;
    }) {
        return api.post("/emotion/log", data);
    },

    history(userId: number) {
        return api.get(`/emotion/history/${userId}`);
    },
};

export const aiEmotionApi = {
    predict(data: EmotionRequest): Promise<EmotionResponse> {
        return api.post("/ai/predict-emotion", data);
    },
};

export const sessionAnalysisApi = {
    analyze(data: {
        pre_emotion: string;
        post_mood: string;
        duration: number;
    }): Promise<SessionAnalysis> {
        return api.post(`/session-analysis/analyze`, data);
    },
};

export const analyticsApi = {
    progress: (userId: number, period: Period = "week") =>
        api.get(`/analytics/progress/${userId}?period=${period}`),

    emotionTrend: (userId: number, period: Period = "week") =>
        api.get(`/analytics/emotion-trend/${userId}?period=${period}`),

    completionMap: (userId: number) =>
        api.get(`/analytics/completion/${userId}`),

    moodWeek: (userId: number) =>
        api.get(`/analytics/mood-week/${userId}`),

    moodHistory: (userId: number): Promise<{ status: string; history: { mood: number; date: string }[] }> =>
        api.get(`/analytics/mood-history/${userId}`),
};

export const profileApi = {
    fetch(userId: number): Promise<ProfileData> {
        return api.get(`/profile/${userId}`);
    },

    uploadPhoto(userId: number, file: File): Promise<string> {
        const formData = new FormData();
        formData.append("user_id", userId.toString());
        formData.append("file", file);

        return api.upload("/profile/upload-photo", formData).then(d => d.profile_image);
    },

    updatePreferences(userId: number, data: UpdatePreferencesData): Promise<void> {
        return api.put(`/profile/preferences/${userId}`, data);
    }
};

// --- Session Global Helper ---
export const sessionHelper = {
    save: (userId: number, name: string) => {
        localStorage.setItem("zen_user_id", String(userId));
        localStorage.setItem("zen_user_name", name);
    },
    getUserId: () => localStorage.getItem("zen_user_id"),
    getUserName: () => localStorage.getItem("zen_user_name"),
    clear: () => {
        localStorage.removeItem("zen_user_id");
        localStorage.removeItem("zen_user_name");
    },
};