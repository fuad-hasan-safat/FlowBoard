import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../lib/socket";

export const useCommentRealtime = (
  orgId?: string | null,
  projectId?: string | null,
  taskId?: string | null
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orgId || !projectId || !taskId) return;

    const socket = getSocket();

    const handler = (payload: {
      taskId: string;
      projectId: string;
    }) => {
      if (payload.taskId === taskId) {
        queryClient.invalidateQueries({
          queryKey: ["comments", orgId, projectId, taskId]
        });
      }
    };

    socket.on("task:comment:created", handler);

    return () => {
      socket.off("task:comment:created", handler);
    };
  }, [orgId, projectId, taskId, queryClient]);
};
