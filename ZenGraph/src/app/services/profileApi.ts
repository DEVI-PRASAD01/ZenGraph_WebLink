const BASE_URL = "http://180.235.121.253:8134";

export interface ProfileData {
  id: number;
  name: string;
  email: string;
  profile_image: string;
  enable_notifications: boolean;
  data_sharing_consent: boolean;
  total_sessions?: number;
  total_minutes?: number;
  current_streak?: number;
}

export const profileApi = {
  // ================= FETCH PROFILE =================
  fetch: async (userId: number): Promise<ProfileData> => {
    try {
      const res = await fetch(`${BASE_URL}/profile/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      return await res.json();
    } catch (error) {
      console.error("profileApi.fetch error:", error);
      throw error;
    }
  },

  // ================= UPDATE PREFERENCES =================
  updatePreferences: async (
    userId: number,
    data: { enable_notifications: boolean; data_sharing_consent: boolean }
  ) => {
    try {
      const res = await fetch(`${BASE_URL}/profile/preferences/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update preferences");
      return await res.json();
    } catch (error) {
      console.error("profileApi.updatePreferences error:", error);
      throw error;
    }
  },

  // ================= UPLOAD PROFILE PHOTO =================
  uploadPhoto: async (userId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("user_id", userId.toString());
      formData.append("file", file);

      const res = await fetch(
        `${BASE_URL}/profile/upload-profile-image`, // ✅ FIXED ENDPOINT
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Upload failed response:", errorText);
        throw new Error("Failed to upload photo");
      }

      const data = await res.json();
      return data.profile_image; // returns image URL
    } catch (error) {
      console.error("profileApi.uploadPhoto error:", error);
      throw error;
    }
  },
};