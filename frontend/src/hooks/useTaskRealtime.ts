import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Task } from "../api/taskApi";
import { initSocket } from "../lib/socket";

export default function useTaskRealtime(
  orgId?: string | null,
  projectId?: string | null
) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!orgId || !projectId) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const socket = initSocket(token);
    const room = `org:${orgId}:project:${projectId}`;
    const queryKey = ["tasks", orgId, projectId];

    // 🔴 ALWAYS join room
    socket.emit("joinRoom", room);
    console.log("CLIENT JOIN ROOM:", room);

    const onCreated = (task: any) => {
      queryClient.setQueryData(queryKey, (old: any[]) =>
        old?.some((t) => t._id === task._id) ? old : [...(old ?? []), task]
      );
    };

    const onUpdated = (task: any) => {
      queryClient.setQueryData(queryKey, (old: any[]) =>
        old?.map((t) => (t._id === task._id ? task : t))
      );
    };

    const onDeleted = ({ taskId }: { taskId: string }) => {
      queryClient.setQueryData(queryKey, (old: any[]) =>
        old?.filter((t) => t._id !== taskId)
      );
    };

    socket.on("task:created", onCreated);
    socket.on("task:updated", onUpdated);
    socket.on("task:deleted", onDeleted);

    return () => {
      socket.emit("leaveRoom", room);
      socket.off("task:created", onCreated);
      socket.off("task:updated", onUpdated);
      socket.off("task:deleted", onDeleted);
    };
  }, [orgId, projectId, queryClient]);
}
