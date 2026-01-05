import { io, Socket } from "socket.io-client";


let socket: Socket | null = null;

export function getSocket(token?: string) {
    if (!socket) {
        if(!token) throw new Error("token not found");
        socket = io(process.env.NEXT_PUBLIC_API_URL, {
            transports: ["websocket"],
            auth: {
                token
            },
            autoConnect: true
        })
    }
    return socket;
}