export const API_BASE = "http://180.235.121.253:8134";

async function request(url: string, options?: RequestInit) {
    const token = localStorage.getItem("zg_token") ?? "";

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    upload: (path: string, formData: FormData) => {
        const token = localStorage.getItem("zg_token") ?? "";
        return fetch(`${API_BASE}${path}`, {
            method: "POST",
            body: formData,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).then(async res => {
            if (!res.ok) throw new Error("Upload failed");
            return res.json();
        });
    },
};