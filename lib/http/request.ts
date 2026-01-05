import { AxiosError, AxiosRequestConfig } from "axios";
import { apiClient } from "./axios";
import { ApiException } from "./errors";
import { ApiError, ApiResponse } from "@/types/api";
import "@/lib/http/interceptors";

export const request = async<T>(config: AxiosRequestConfig): Promise<T> => {
    try {
        const res = await apiClient.request<ApiResponse<T>>(config);
        if (!res.data.success) {
            throw new ApiException(
                res.data.error.code,
                res.data.error.message,
                res.status
            );
        }

        return res.data.data;
    } catch (err: any) {

        if (err instanceof AxiosError && err.response?.data) {
            const data = err.response.data as ApiError;
            if (data.success === false) {
                throw new ApiException(
                    data.error.code,
                    data.error.message,
                    err.response.status,
                    data.error.details
                );
            }
        }

        if (err instanceof ApiException) throw err;

        throw new ApiException(
            "INTERNAL_ERROR",
            "Network or server error",
            err.response?.status
        );
    }
} 