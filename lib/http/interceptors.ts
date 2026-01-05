import { ERROR_CODES } from "@/types/api";
import { apiClient } from "./axios"; 

let isRefreshing = false;
let refreshSubscriber: (() => void)[] = []



const HandleLogout = () => {
    console.log("IN these")
    if (window.location.href !== "/login") {
        window.location.href = "/login"
    }
}
const subscribeTokenRefresh = (callback: () => void) => {
    refreshSubscriber.push(callback)
};

const onRefreshSuccess = () => {
    refreshSubscriber.forEach((callback) => callback());
    refreshSubscriber = []
}

apiClient.interceptors.response.use(
    res => res,
    async (error) => {
        const original = error.config; 
        const code = error.response?.data?.error?.code
        if (error.response?.status === 401 && (code === ERROR_CODES.TOKEN_EXPIRED || code === ERROR_CODES.INVALID_TOKEN)  && !original._retry) {
            
            if (isRefreshing) { 
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => resolve(apiClient(original)))
                })
            }
            
            original._retry = true;
            isRefreshing = true;
            try { 
                await apiClient.get("/auth/refresh-token"); 
                isRefreshing = false;
                onRefreshSuccess();
                return apiClient(original);
            } catch (err) {
                isRefreshing = false;
                refreshSubscriber = []; 
                HandleLogout();
                Promise.reject(err)
            }
        }

        return Promise.reject(error);
    }
);
