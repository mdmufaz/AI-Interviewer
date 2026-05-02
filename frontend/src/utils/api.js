export const authFetch = async (url, options = {}) => {
    
    // ✅ Step 1 - Get token from localStorage
    const token = localStorage.getItem("token");

    // ✅ Step 2 - Build headers with token
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    // ✅ Step 3 - Add Content-Type only if NOT FormData
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    // ✅ Step 4 - Make the actual fetch call
    const res = await fetch(url, {
        ...options,
        headers,
    });

    // ✅ Step 5 - If token expired, auto logout
    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    // ✅ Step 6 - Return response just like normal fetch
    return res;
};