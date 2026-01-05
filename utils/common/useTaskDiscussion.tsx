"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export function useTaskComments(taskId: string) {
  useEffect(() => {
    const socket = getSocket();

    const onNewComment = (comment: any) => {
      console.log(comment)
    };

    socket.on("task:comment:new", onNewComment);

    return () => {
      socket.off("task:comment:new", onNewComment);
    };
  }, [taskId]);
}
