import { request } from "@/lib/http/request";
import { UserDataResponse, usersResponse } from "@/utils/interfaces/responses/user.response";

export const userService = {
    getUserData() {
        return request<UserDataResponse>({
            method: "GET",
            url: "/dash/user/getuserdata",
        });
    },

    searchUsers({ 
        query,
        signal,
    }: { 
        query: string;
        signal?: AbortSignal;
    }) {
        return request<usersResponse>({
            method: "GET",
            url: `/dash/user/getusers?searchName=${query}`
        });
    }
}

