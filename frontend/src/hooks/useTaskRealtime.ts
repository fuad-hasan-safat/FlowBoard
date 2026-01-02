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

    const invalidate = () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", orgId, projectId],
      });
    };

    socket.on("task:created", invalidate);
    socket.on("task:updated", invalidate);
    socket.on("task:deleted", invalidate);

    return () => {
      socket.off("task:created", invalidate);
      socket.off("task:updated", invalidate);
      socket.off("task:deleted", invalidate);
    };
  }, [orgId, projectId, queryClient]);
};
