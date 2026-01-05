import { request } from "@/lib/http/request";
import { RegisterUserSchemaType } from "@/utils/schemas/auth/RegisterUser.schema";
import { LoginUserSchemaType } from "@/utils/schemas/auth/LoginUser.schema";

interface LoginUserReturnData {
    isWorkSpace: boolean
    isInvitaion: boolean
}

export const AuthService = { 

    registerUser(data: RegisterUserSchemaType): Promise<void> {
        return request({
            method: "POST",
            url: "/auth/signup",
            data
        });
    },

    verifyOtp(email: string, otp: string): Promise<void> {
        return request({
            method: "POST",
            url: "/auth/verify-otp",
            data: {
                email: email,
                otp: otp
            }
        })
    },
    LoginUser(data: LoginUserSchemaType): Promise<LoginUserReturnData> {
        return request<LoginUserReturnData>({
            method: "POST",
            url: "/auth/login",
            data
        })
    }
}