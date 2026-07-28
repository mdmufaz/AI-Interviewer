export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const BASE_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    return res;
};