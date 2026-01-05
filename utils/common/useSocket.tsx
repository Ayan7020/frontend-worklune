"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export function useSocket() {
  useEffect(() => { 

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
     
    };
  }, []);
}
