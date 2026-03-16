export const API_BASE = "http://127.0.0.1:8000";

async function request(url: string, options?: RequestInit) {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        credentials: "include",
        ...options,
    });

    if (!res.ok) {
        let errorMessage = "API request failed";
        try {
            const errorData = await res.json();
            errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
            if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail[0].msg;
            }
        } catch (e) {
            // Not JSON
        }
        throw new Error(errorMessage);
    }

    return res.json();
}

export const api = {
    get: (path: string) => request(`${API_BASE}${path}`),
    post: (path: string, body: any) =>
        request(`${API_BASE}${path}`, {
            method: "POST",
            body: JSON.stringify(body),
        }),
    put: (path: string, body: any) =>
        request(`${API_BASE}${path}`, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    delete: (path: string) =>
        request(`${API_BASE}${path}`, {
            method: "DELETE",
        }),
    // For file uploads
    upload: (path: string, formData: FormData) =>
        fetch(`${API_BASE}${path}`, {
            method: "POST",
            body: formData,
            // Note: Do not set Content-Type header, fetch will set it with boundary
        }).then(async res => {
            if (!res.ok) throw new Error("Upload failed");
            return res.json();
        }),
};
