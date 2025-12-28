import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../lib/socket";

export const useTaskRealtime = (
  orgId?: string | null,
  projectId?: string | null
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orgId || !projectId) return;

    const socket = getSocket();
    const room = `org:${orgId}:project:${projectId}`;

    console.log("CLIENT JOIN ROOM:", room);
    socket.emit("joinRoom", room);

    socket.on("task:created", () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", orgId, projectId]
      });
    });

    socket.on("task:updated", () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", orgId, projectId]
      });
    });

    socket.on("task:deleted", () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", orgId, projectId]
      });
    });

    return () => {
      socket.emit("leaveRoom", room);
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
    };
  }, [orgId, projectId, queryClient]);
};
