import axios from 'axios'

const apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('medflowToken');

    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let refreshPromise = null

async function refreshToken() {
    if (!refreshPromise) {
        refreshPromise = axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/auth/refresh`,
                {
                    refresh_token:
                        localStorage.getItem("medflowRefreshToken"),
                }
            ).then((response) => {
                const { access_token, refresh_token} = response.data;
                localStorage.setItem("medflowToken", access_token);
                localStorage.setItem("medflowRefreshToken", refresh_token)
                return access_token
            }).finally(() => {
                refreshPromise = null;
            })
    }
    return refreshPromise
}


apiClient.interceptors.response.use((response) => response,

    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status !== 401 || originalRequest?._retry) {
            return Promise.reject(error);
        }
        if (originalRequest?.url?.includes("/auth/refresh") || originalRequest?.url?.includes("/auth/token")) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const newAccessToken = await refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);

        } catch (refreshError) {
            localStorage.removeItem("medflowToken");
            localStorage.removeItem("medflowRefreshToken");
            return Promise.reject(refreshError);
        }
    }
);


export default apiClient; 