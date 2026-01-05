import { APIErrorDetails, ErrorCode } from "@/types/api";

export class ApiException extends Error {
    constructor(public code: ErrorCode, message: string, public status?: number,public details?: APIErrorDetails) {
        super(message);
    }
}